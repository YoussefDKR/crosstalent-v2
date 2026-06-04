import { PROFILE_IMAGES_BUCKET } from "@/config/images";

/** Legacy rows may store a full URL; new uploads store a storage path. */
export function isStoragePath(value: string): boolean {
  return (
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    value.includes("/")
  );
}

export function publicStorageUrl(
  path: string,
  bucket = PROFILE_IMAGES_BUCKET
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return path;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

export function resolveImageUrl(
  pathOrUrl: string | null | undefined
): string | null {
  if (!pathOrUrl?.trim()) return null;
  const v = pathOrUrl.trim();
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return publicStorageUrl(v);
}
