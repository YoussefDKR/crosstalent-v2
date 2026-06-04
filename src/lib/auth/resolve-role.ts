import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

export async function resolveUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient();

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
