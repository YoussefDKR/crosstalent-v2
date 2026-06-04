export const PROFILE_IMAGES_BUCKET = "profile-images";

/** Max size before server-side compression (input file). */
export const IMAGE_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

export const CANDIDATE_AVATAR_PATH = (userId: string) =>
  `candidates/${userId}/avatar.webp`;

export const COMPANY_LOGO_PATH = (userId: string) =>
  `companies/${userId}/logo.webp`;
