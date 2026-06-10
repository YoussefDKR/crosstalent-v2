export const VISITOR_COOKIE = "ct_vid";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function shouldTrackVisitPath(pathname: string): boolean {
  if (!pathname || pathname.startsWith("//")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/_next")) return false;
  if (pathname.includes(".")) return false;
  return true;
}
