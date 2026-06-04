import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

type ProfileRow = {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
};

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return mapProfile(profile as ProfileRow);
  }

  const { data: ensured } = await supabase.rpc("ensure_user_profile");

  if (!ensured) return null;

  return mapProfile(ensured as ProfileRow);
}

export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
}
