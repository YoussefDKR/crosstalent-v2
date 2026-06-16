import { createHmac, timingSafeEqual } from "crypto";

const TICKET_TTL_MS = 24 * 60 * 60 * 1000;

function getSigningSecret(): string | null {
  const secret =
    process.env.PASSWORD_RECOVERY_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return secret || null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Signed ticket for password recovery — keeps the Supabase token out of email URLs. */
export function createRecoveryTicket(tokenHash: string): string | null {
  const secret = getSigningSecret();
  if (!secret || !tokenHash.trim()) return null;

  const expiresAt = Date.now() + TICKET_TTL_MS;
  const body = `${expiresAt}:${tokenHash}`;
  const signature = signPayload(body, secret);
  return Buffer.from(`${body}:${signature}`).toString("base64url");
}

export function verifyRecoveryTicket(ticket: string): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;

  try {
    const decoded = Buffer.from(ticket, "base64url").toString("utf8");
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

    const colonIdx = body.indexOf(":");
    if (colonIdx === -1) return null;

    const expiresAt = Number(body.slice(0, colonIdx));
    const tokenHash = body.slice(colonIdx + 1);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt || !tokenHash) {
      return null;
    }

    return tokenHash;
  } catch {
    return null;
  }
}
