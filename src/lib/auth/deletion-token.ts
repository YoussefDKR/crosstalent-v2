import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

type DeletionTokenPayload = {
  userId: string;
  email: string;
};

function getSigningSecret(): string | null {
  const secret =
    process.env.ACCOUNT_DELETION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return secret || null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createDeletionToken(
  userId: string,
  email: string
): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const body = `${userId}:${normalizedEmail}:${expiresAt}`;
  const signature = signPayload(body, secret);
  return Buffer.from(`${body}:${signature}`).toString("base64url");
}

export function verifyDeletionToken(token: string): DeletionTokenPayload | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const body = decoded.slice(0, lastColon);
    const signature = decoded.slice(lastColon + 1);
    const expected = signPayload(body, secret);

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }

    const [userId, email, expiresAtRaw] = body.split(":");
    if (!userId || !email || !expiresAtRaw) return null;

    const expiresAt = Number(expiresAtRaw);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;

    return { userId, email };
  } catch {
    return null;
  }
}
