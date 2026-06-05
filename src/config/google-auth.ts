export function getGoogleClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  return id || null;
}

export function getGoogleClientSecret(): string | null {
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  return secret || null;
}

/** Client-side: only the public client ID is available in the browser. */
export function isBrandedGoogleOAuthEnabled(): boolean {
  return Boolean(getGoogleClientId());
}

/** Server-side: needs the secret to exchange the auth code. */
export function isBrandedGoogleOAuthConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}
