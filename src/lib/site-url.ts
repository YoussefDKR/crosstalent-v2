/** Canonical app URL for auth redirects and Stripe (must match Supabase Site URL). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  return url.replace(/\/$/, "");
}
