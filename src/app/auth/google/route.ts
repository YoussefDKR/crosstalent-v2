import { NextResponse } from "next/server";
import { isBrandedGoogleOAuthConfigured } from "@/config/google-auth";
import { generateGoogleNonce } from "@/lib/auth/google-nonce";
import {
  buildGoogleAuthUrl,
  getGoogleOAuthRedirectUri,
} from "@/lib/auth/google-oauth";
import { createGoogleOAuthState } from "@/lib/auth/google-oauth-state";
import { parseSignupRole } from "@/lib/auth/routes";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  if (!isBrandedGoogleOAuthConfigured()) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_oauth_not_configured");
    return NextResponse.redirect(url);
  }

  const signupRole = parseSignupRole(searchParams.get("role"));
  const next = searchParams.get("next") ?? "/";
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const supabase = await createClient();
  let intentId: string | undefined;

  if (signupRole) {
    const { data, error } = await supabase.rpc("create_oauth_signup_intent", {
      p_role: signupRole,
    });

    if (error || !data) {
      const url = new URL(`${origin}/signup`);
      url.searchParams.set("error", "google_signup_failed");
      if (signupRole) url.searchParams.set("role", signupRole);
      return NextResponse.redirect(url);
    }

    intentId = data as string;
  }

  const [nonce, hashedNonce] = generateGoogleNonce();
  const state = createGoogleOAuthState({
    nonce,
    intentId,
    next: safeNext,
  });

  if (!state) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_oauth_not_configured");
    return NextResponse.redirect(url);
  }

  const siteUrl = getSiteUrl();
  const redirectUri = getGoogleOAuthRedirectUri(siteUrl);
  const authUrl = buildGoogleAuthUrl({
    redirectUri,
    state,
    hashedNonce,
  });

  return NextResponse.redirect(authUrl);
}
