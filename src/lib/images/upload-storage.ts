import { PROFILE_IMAGES_BUCKET } from "@/config/images";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/** Upload image bytes; uses service role when available to avoid storage RLS edge cases. */
export async function uploadProfileImage(
  path: string,
  body: Buffer,
  contentType = "image/webp"
): Promise<{ error: string | null }> {
  const options = { upsert: true, contentType };

  if (isSupabaseAdminConfigured()) {
    const admin = createAdminClient();
    const { error } = await admin.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(path, body, options);
    return { error: error?.message ?? null };
  }

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(path, body, options);
  return { error: error?.message ?? null };
}

export async function removeProfileImage(path: string): Promise<void> {
  if (isSupabaseAdminConfigured()) {
    const admin = createAdminClient();
    await admin.storage.from(PROFILE_IMAGES_BUCKET).remove([path]);
    return;
  }
  const supabase = await createClient();
  await supabase.storage.from(PROFILE_IMAGES_BUCKET).remove([path]);
}
