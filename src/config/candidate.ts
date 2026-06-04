export const MENA_COUNTRIES = [
  { code: "MA", label: "Morocco" },
  { code: "DZ", label: "Algeria" },
  { code: "TN", label: "Tunisia" },
  { code: "EG", label: "Egypt" },
  { code: "LY", label: "Libya" },
  { code: "MR", label: "Mauritania" },
  { code: "OTHER", label: "Other MENA" },
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

export const LANGUAGE_PROFICIENCIES = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "professional", label: "Professional" },
  { value: "native", label: "Native" },
] as const;

export const COMMON_LANGUAGES = [
  "Arabic",
  "French",
  "English",
  "Spanish",
  "German",
  "Italian",
  "Berber (Tamazight)",
] as const;

/** Minimum bio length to count toward profile strength on the dashboard */
export const BIO_MIN_LENGTH = 40;

export const CV_BUCKET = "candidate-cvs";
export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
