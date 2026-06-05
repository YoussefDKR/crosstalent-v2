/** Production hostname from NEXT_PUBLIC_APP_URL (e.g. www.crosstalent.io). */
export function getCanonicalHost(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return null;
  try {
    return new URL(appUrl).hostname;
  } catch {
    return null;
  }
}

import type { NextRequest } from "next/server";

/**
 * When the canonical URL uses www, redirect bare apex (crosstalent.io) to www.
 * Skips localhost and preview hosts.
 */
export function redirectApexToWww(request: NextRequest): Response | null {
  const canonicalHost = getCanonicalHost();
  if (!canonicalHost?.startsWith("www.")) return null;

  const requestHost =
    request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const apexHost = canonicalHost.slice(4);

  if (!requestHost || requestHost === canonicalHost) return null;
  if (requestHost === "localhost" || requestHost.endsWith(".vercel.app")) {
    return null;
  }
  if (requestHost !== apexHost) return null;

  const url = request.nextUrl.clone();
  url.hostname = canonicalHost;
  url.protocol = "https:";
  return Response.redirect(url, 308);
}
