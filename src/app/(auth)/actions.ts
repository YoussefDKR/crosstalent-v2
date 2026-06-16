"use server";

import { redirect } from "next/navigation";
import { isContactEmailConfigured } from "@/config/contact";
import { recordSignupCountry } from "@/lib/auth/record-signup-country";
import { getMissingPasswordRequirementIds } from "@/lib/auth/password-strength";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset";
import { createClient } from "@/lib/supabase/server";
import {
  createAdminClient,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/admin";
import { getServerI18n } from "@/i18n/server";
import type { Messages } from "@/i18n/dictionaries/en";
import { AUTH_ROUTES, getDashboardPath, parseSignupRole } from "@/lib/auth/routes";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { ensureCompanyProfileRow, getEmployerEntryPath } from "@/lib/employer/queries";
import {
  isValidWebsiteUrl,
  normalizeWebsiteUrl,
} from "@/lib/employer/onboarding";
import type { UserRole } from "@/types";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
}

function rolePathPrefix(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "employer") return "/employer";
  return "/candidate";
}

async function redirectByRole(
  role: UserRole,
  userId: string,
  fallback?: string
): Promise<never> {
  if (fallback && fallback.startsWith(rolePathPrefix(role))) {
    redirect(fallback);
  }
  if (role === "employer") {
    redirect(await getEmployerEntryPath(userId));
  }
  redirect(getDashboardPath(role));
}

export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = parseSignupRole(String(formData.get("role") ?? ""));

  if (!fullName || !email || !password) {
    return { error: "Please fill in all required fields." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!role) {
    return { error: "Please select whether you are a candidate or employer." };
  }

  let companyName = "";
  let website = "";
  if (role === "employer") {
    companyName = String(formData.get("companyName") ?? "").trim();
    const websiteRaw = String(formData.get("website") ?? "").trim();
    if (!companyName) {
      return { error: "Company name is required for employer accounts." };
    }
    if (!isValidWebsiteUrl(websiteRaw)) {
      return {
        error: "Enter a valid company website (e.g. yourcompany.com).",
      };
    }
    website = normalizeWebsiteUrl(websiteRaw);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}${AUTH_ROUTES.callback}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (role === "employer" && data.user) {
    await ensureCompanyProfileRow(data.user.id);
    const { error: companyError } = await supabase.from("company_profiles").upsert(
      {
        user_id: data.user.id,
        company_name: companyName,
        website,
      },
      { onConflict: "user_id" }
    );

    if (companyError) {
      return { error: companyError.message };
    }
  }

  if (data.session && data.user) {
    await recordSignupCountry(data.user.id);
    const resolvedRole = (await resolveUserRole(data.user.id)) ?? role;
    return redirectByRole(resolvedRole, data.user.id);
  }

  return {
    success:
      "Account created. Check your email to confirm your address, then sign in.",
  };
}

export async function signIn(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Unable to sign in. Please try again." };
  }

  const role = await resolveUserRole(data.user.id);

  if (!role) {
    return {
      error:
        "Your profile could not be loaded. In Supabase → SQL Editor, run the migrations listed in supabase/README.md (Phase 2 first), then try again.",
    };
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileRow?.is_banned) {
    await supabase.auth.signOut();
    return {
      error: "Your account has been suspended. Contact support for help.",
    };
  }

  await recordSignupCountry(data.user.id);
  return redirectByRole(role, data.user.id, redirectTo || undefined);
}

const PASSWORD_REQ_KEYS: Record<string, keyof Messages["account"]> = {
  length: "reqLength",
  lower: "reqLower",
  upper: "reqUpper",
  number: "reqNumber",
  special: "reqSpecial",
};

function passwordRequirementError(
  messages: Messages,
  missingIds: string[]
): string {
  const a = messages.account;
  const labels = missingIds.map(
    (id) => a[PASSWORD_REQ_KEYS[id] as keyof typeof a] ?? id
  );
  return messages.account.errPasswordMustInclude.replace(
    "{requirements}",
    labels.join(", ")
  );
}

export async function requestPasswordReset(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const { t } = await getServerI18n();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: t("auth.forgotPasswordEmailRequired") };
  }

  const redirectTo = `${getSiteUrl()}${AUTH_ROUTES.callback}?next=${encodeURIComponent(AUTH_ROUTES.resetPassword)}`;

  if (!isContactEmailConfigured() || !isSupabaseAdminConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: t("auth.forgotPasswordSuccess") };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("not found") || msg.includes("no user")) {
      return { success: t("auth.forgotPasswordSuccess") };
    }
    return { error: error.message };
  }

  const resetUrl = data.properties?.action_link;
  if (!resetUrl) {
    return { success: t("auth.forgotPasswordSuccess") };
  }

  const sendResult = await sendPasswordResetEmail(email, resetUrl, {
    subject: t("auth.resetPasswordEmailSubject"),
    title: t("auth.resetPasswordEmailTitle"),
    bodyHtml: t("auth.resetPasswordEmailBody"),
    ctaLabel: t("auth.resetPasswordEmailCta"),
    footerNote: t("auth.resetPasswordEmailFooter"),
  });

  if (!sendResult.ok) {
    return { error: sendResult.error };
  }

  return { success: t("auth.forgotPasswordSuccess") };
}

export async function completePasswordReset(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const { messages, t } = await getServerI18n();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t("auth.resetPasswordSessionExpired") };
  }

  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const missingIds = getMissingPasswordRequirementIds(newPassword);
  if (missingIds.length > 0) {
    return { error: passwordRequirementError(messages, missingIds) };
  }

  if (newPassword !== confirmPassword) {
    return { error: messages.account.passwordsNoMatch };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message };
  }

  const role = await resolveUserRole(user.id);
  if (!role) {
    redirect(AUTH_ROUTES.login);
  }

  return redirectByRole(role, user.id);
}
