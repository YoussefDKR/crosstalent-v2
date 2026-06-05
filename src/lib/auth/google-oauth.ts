import { getGoogleClientId, getGoogleClientSecret } from "@/config/google-auth";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export function getGoogleOAuthRedirectUri(siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/auth/google/callback`;
}

export function buildGoogleAuthUrl(options: {
  redirectUri: string;
  state: string;
  hashedNonce: string;
}): string {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("Google client ID is not configured");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: options.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: options.state,
    nonce: options.hashedNonce,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeGoogleAuthCode(
  code: string,
  redirectUri: string
): Promise<{ ok: true; idToken: string } | { ok: false; error: string }> {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();

  if (!clientId || !clientSecret) {
    return { ok: false, error: "Google OAuth is not configured." };
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = (await response.json()) as {
    id_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.id_token) {
    return {
      ok: false,
      error: data.error_description || data.error || "Google sign-in failed.",
    };
  }

  return { ok: true, idToken: data.id_token };
}
