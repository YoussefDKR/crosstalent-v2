import { createHmac, timingSafeEqual } from "crypto";

const STATE_TTL_MS = 30 * 60 * 1000;

export type GoogleOAuthState = {
  nonce: string;
  intentId?: string;
  next: string;
  redirectUri: string;
};

type SignedStatePayload = GoogleOAuthState & { exp: number };

function getSigningSecret(): string | null {
  const secret =
    process.env.GOOGLE_OAUTH_STATE_SECRET?.trim() ||
    process.env.ACCOUNT_DELETION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return secret || null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createGoogleOAuthState(
  payload: GoogleOAuthState
): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const body: SignedStatePayload = {
    ...payload,
    exp: Date.now() + STATE_TTL_MS,
  };
  const json = JSON.stringify(body);
  const signature = signPayload(json, secret);
  return Buffer.from(`${json}.${signature}`).toString("base64url");
}

export function verifyGoogleOAuthState(
  token: string
): GoogleOAuthState | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const separator = decoded.lastIndexOf(".");
    if (separator === -1) return null;

    const json = decoded.slice(0, separator);
    const signature = decoded.slice(separator + 1);
    const expected = signPayload(json, secret);

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }

    const body = JSON.parse(json) as SignedStatePayload;
    if (
      !body.nonce ||
      !body.next ||
      !body.redirectUri ||
      !Number.isFinite(body.exp) ||
      Date.now() > body.exp
    ) {
      return null;
    }

    if (!body.next.startsWith("/") || body.next.startsWith("//")) {
      return null;
    }

    if (
      !body.redirectUri.startsWith("https://") &&
      !body.redirectUri.startsWith("http://localhost")
    ) {
      return null;
    }

    return {
      nonce: body.nonce,
      intentId: body.intentId,
      next: body.next,
      redirectUri: body.redirectUri,
    };
  } catch {
    return null;
  }
}
