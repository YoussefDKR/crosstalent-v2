import {
  CANDIDATE_AVATAR_PATH,
  COMPANY_LOGO_PATH,
  PROFILE_IMAGES_BUCKET,
} from "@/config/images";
import { verifyDeletionToken } from "@/lib/auth/deletion-token";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import type { UserRole } from "@/types";

const CV_BUCKET = "candidate-cvs";

async function cleanupUserStorage(
  userId: string,
  role: UserRole
): Promise<void> {
  if (!isSupabaseAdminConfigured()) return;

  const admin = createAdminClient();
  const imagePaths = [CANDIDATE_AVATAR_PATH(userId)];

  if (role === "employer") {
    imagePaths.push(COMPANY_LOGO_PATH(userId));
  }

  await admin.storage.from(PROFILE_IMAGES_BUCKET).remove(imagePaths);

  if (role === "candidate") {
    const { data: files } = await admin.storage.from(CV_BUCKET).list(userId);
    if (files?.length) {
      await admin.storage
        .from(CV_BUCKET)
        .remove(files.map((file) => `${userId}/${file.name}`));
    }
  }
}

export async function deleteAccountById(
  userId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Account deletion is not configured." };
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  if (!profile) {
    return { ok: false, error: "Account not found." };
  }

  await cleanupUserStorage(userId, profile.role as UserRole);

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function confirmAndDeleteAccount(
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = verifyDeletionToken(token);
  if (!payload) {
    return { ok: false, error: "This confirmation link is invalid or has expired." };
  }

  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Account deletion is not configured." };
  }

  const admin = createAdminClient();
  const { data: userData, error: userError } =
    await admin.auth.admin.getUserById(payload.userId);

  if (userError || !userData.user) {
    return { ok: false, error: "Account not found or already deleted." };
  }

  const accountEmail = userData.user.email?.trim().toLowerCase();
  if (!accountEmail || accountEmail !== payload.email) {
    return {
      ok: false,
      error: "This confirmation link is invalid or has expired.",
    };
  }

  return deleteAccountById(payload.userId);
}
