import { createClient } from "@/lib/supabase/client";
import { getPostLoginPath } from "@/lib/auth/post-login";
import type { UserRole } from "@/types";

export { getPostLoginPath };

export async function resolveUserRoleClient(
  userId: string
): Promise<UserRole | null> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role) {
    return profile.role as UserRole;
  }

  const { data: ensured, error } = await supabase.rpc("ensure_user_profile");

  if (error || !ensured?.role) {
    return null;
  }

  return ensured.role as UserRole;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ role: UserRole } | { error: string }> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error:
          "Please confirm your email first. Check your inbox (and spam), then try again.",
      };
    }
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Unable to sign in. Please try again." };
  }

  const role = await resolveUserRoleClient(data.user.id);

  if (!role) {
    return {
      error:
        "Your profile could not be loaded. Run the Supabase migrations in supabase/README.md, then try again.",
    };
  }

  return { role };
}

export async function signOutClient(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
