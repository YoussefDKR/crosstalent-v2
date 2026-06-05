export function getGoogleClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return id || null;
}

export function getGoogleClientSecret(): string | null {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return secret || null;
}

/** Branded Google sign-in (shows CrossTalent on Google's screen, not *.supabase.co). */
export function isBrandedGoogleOAuthConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}
