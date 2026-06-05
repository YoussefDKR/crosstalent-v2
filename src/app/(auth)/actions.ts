"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_ROUTES, getDashboardPath, parseSignupRole } from "@/lib/auth/routes";
import { resolveUserRole } from "@/lib/auth/resolve-role";
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

  if (data.session && data.user) {
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

  redirectByRole(role, redirectTo || undefined);
}
