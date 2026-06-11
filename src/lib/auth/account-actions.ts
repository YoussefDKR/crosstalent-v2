"use server";

import { revalidatePath } from "next/cache";
import { createDeletionToken } from "@/lib/auth/deletion-token";
import { getMissingPasswordRequirementIds } from "@/lib/auth/password-strength";
import { getCurrentProfile } from "@/lib/auth/session";
import { getServerI18n } from "@/i18n/server";
import type { Messages } from "@/i18n/dictionaries/en";
import { siteConfig } from "@/config/site";
import { sendAccountDeletionEmail } from "@/lib/email/send-account-deletion";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import type { UserRole } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AccountActionResult = {
  error?: string;
  success?: string;
};

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

function revalidateForRole(role: UserRole) {
  if (role === "candidate") {
    [
      "/candidate/dashboard",
      "/candidate/profile",
      "/candidate/settings",
    ].forEach((path) => revalidatePath(path));
  } else if (role === "employer") {
    [
      "/employer/dashboard",
      "/employer/company",
      "/employer/settings",
      "/employer/applications",
    ].forEach((path) => revalidatePath(path));
  } else {
    ["/admin/dashboard", "/admin/settings"].forEach((path) =>
      revalidatePath(path)
    );
  }
}

async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Unauthorized");
  return profile;
}

export async function updateAccountName(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  const { messages } = await getServerI18n();
  const a = messages.account;
  try {
    const profile = await requireProfile();
    const fullName = String(formData.get("fullName") ?? "").trim();

    if (!fullName) {
      return { error: a.errFullNameRequired };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) return { error: error.message };

    revalidateForRole(profile.role);
    return { success: a.successNameSaved };
  } catch {
    return { error: a.errGeneric };
  }
}

export async function updateAccountEmail(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  const { messages } = await getServerI18n();
  const a = messages.account;
  try {
    const profile = await requireProfile();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: a.errValidEmail };
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentEmail = userData.user?.email?.toLowerCase();

    if (currentEmail === email) {
      return { success: a.successEmailAlreadyYours };
    }

    const { error: authError } = await supabase.auth.updateUser({ email });

    if (authError) return { error: authError.message };

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ email })
      .eq("id", profile.id);

    if (profileError) return { error: profileError.message };

    revalidateForRole(profile.role);
    return { success: a.successEmailUpdateStarted };
  } catch {
    return { error: a.errGeneric };
  }
}

export async function updateAccountPassword(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  const { messages } = await getServerI18n();
  const a = messages.account;
  try {
    await requireProfile();

    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const missingIds = getMissingPasswordRequirementIds(newPassword);
    if (missingIds.length > 0) {
      return { error: passwordRequirementError(messages, missingIds) };
    }

    if (newPassword !== confirmPassword) {
      return { error: a.passwordsNoMatch };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) return { error: error.message };

    return { success: a.successPasswordUpdated };
  } catch {
    return { error: a.errGeneric };
  }
}

export async function requestAccountDeletion(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  const { messages } = await getServerI18n();
  const a = messages.account;
  try {
    const profile = await requireProfile();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return { error: a.errValidEmail };
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const accountEmail = userData.user?.email?.trim().toLowerCase();

    if (!accountEmail) {
      return { error: a.errCouldNotVerifyEmail };
    }

    if (email !== accountEmail) {
      return { error: a.errEmailMismatch };
    }

    const token = createDeletionToken(profile.id, accountEmail);
    if (!token) {
      return { error: a.errDeletionNotConfigured };
    }

    const confirmUrl = `${siteConfig.url}/account/delete/confirm?token=${encodeURIComponent(token)}`;
    const result = await sendAccountDeletionEmail(accountEmail, confirmUrl);

    if (!result.ok) {
      return { error: result.error };
    }

    return { success: a.successDeletionEmailSent };
  } catch {
    return { error: a.errGeneric };
  }
}
