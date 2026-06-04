"use server";

import { revalidatePath } from "next/cache";
import { validatePasswordForSubmit } from "@/lib/auth/password-strength";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import type { UserRole } from "@/types";

export type AccountActionResult = {
  error?: string;
  success?: string;
};

function revalidateForRole(role: UserRole) {
  if (role === "candidate") {
    [
      "/candidate/dashboard",
      "/candidate/profile",
      "/candidate/settings",
    ].forEach((path) => revalidatePath(path));
  } else {
    [
      "/employer/dashboard",
      "/employer/company",
      "/employer/settings",
      "/employer/applications",
    ].forEach((path) => revalidatePath(path));
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
  try {
    const profile = await requireProfile();
    const fullName = String(formData.get("fullName") ?? "").trim();

    if (!fullName) {
      return { error: "Full name is required." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.id);

    if (error) return { error: error.message };

    revalidateForRole(profile.role);
    return { success: "Name saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function updateAccountEmail(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  try {
    const profile = await requireProfile();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "Enter a valid email address." };
    }

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentEmail = userData.user?.email?.toLowerCase();

    if (currentEmail === email) {
      return { success: "That is already your email address." };
    }

    const { error: authError } = await supabase.auth.updateUser({ email });

    if (authError) return { error: authError.message };

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ email })
      .eq("id", profile.id);

    if (profileError) return { error: profileError.message };

    revalidateForRole(profile.role);
    return {
      success:
        "Email update started. Check your inbox to confirm the new address.",
    };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function updateAccountPassword(
  _prev: AccountActionResult,
  formData: FormData
): Promise<AccountActionResult> {
  try {
    const profile = await requireProfile();

    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const passwordError = validatePasswordForSubmit(newPassword);
    if (passwordError) return { error: passwordError };

    if (newPassword !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) return { error: error.message };

    return { success: "Password updated successfully." };
  } catch {
    return { error: "Something went wrong." };
  }
}
