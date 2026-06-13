"use server";

import { redirect } from "next/navigation";
import { recordSignupCountry } from "@/lib/auth/record-signup-country";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES, getDashboardPath, parseSignupRole } from "@/lib/auth/routes";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { ensureCompanyProfileRow } from "@/lib/employer/queries";
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

function redirectByRole(role: UserRole, fallback?: string): never {
  if (fallback && fallback.startsWith(rolePathPrefix(role))) {
    redirect(fallback);
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
    redirectByRole(resolvedRole);
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
  redirectByRole(role, redirectTo || undefined);
}
