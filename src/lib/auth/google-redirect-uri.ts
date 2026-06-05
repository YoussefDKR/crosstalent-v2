import { getCanonicalHost } from "@/lib/canonical-host";
import { getSiteUrl } from "@/lib/site-url";

const CALLBACK_PATH = "/auth/google/callback";

export function buildGoogleOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/$/, "")}${CALLBACK_PATH}`;
}

/** Must match a URI registered in Google Cloud Console exactly. */
export function resolveGoogleOAuthRedirectUri(request: Request): string {
  const requestUrl = new URL(request.url);
  const host = requestUrl.hostname.toLowerCase();

  if (host === "localhost" || host === "127.0.0.1") {
    return buildGoogleOAuthRedirectUri(requestUrl.origin);
  }

  const canonicalHost = getCanonicalHost()?.toLowerCase();
  if (canonicalHost) {
    const apexHost = canonicalHost.startsWith("www.")
      ? canonicalHost.slice(4)
      : canonicalHost;

    if (host === canonicalHost || host === apexHost) {
      // Use the host the user is actually on (www vs apex must match Google Console).
      return buildGoogleOAuthRedirectUri(requestUrl.origin);
    }
  }

  return buildGoogleOAuthRedirectUri(new URL(getSiteUrl()).origin);
}
