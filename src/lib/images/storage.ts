import { isStoragePath } from "@/lib/images/urls";
import { removeProfileImage } from "@/lib/images/upload-storage";

export async function removeStorageImageIfOwned(
  pathOrUrl: string | null,
  userId: string
): Promise<void> {
  if (!pathOrUrl || !isStoragePath(pathOrUrl)) return;
  if (!pathOrUrl.includes(userId)) return;
  await removeProfileImage(pathOrUrl);
}
