import { NextResponse } from "next/server";
import { exchangeGoogleAuthCode } from "@/lib/auth/google-oauth";
import { verifyGoogleOAuthState } from "@/lib/auth/google-oauth-state";
import { getPostLoginPath } from "@/lib/auth/post-login";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const oauthError = searchParams.get("error");

  if (oauthError) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_sign_in_cancelled");
    return NextResponse.redirect(url);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  const parsed = verifyGoogleOAuthState(state);
  if (!parsed) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  const tokenResult = await exchangeGoogleAuthCode(
    code,
    parsed.redirectUri
  );

  if (!tokenResult.ok) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: tokenResult.idToken,
    nonce: parsed.nonce,
  });

  if (signInError) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  if (parsed.intentId) {
    await supabase.rpc("apply_oauth_signup_role", {
      p_intent_id: parsed.intentId,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  const role = await resolveUserRole(user.id);
  if (!role) {
    const url = new URL(`${origin}/login`);
    url.searchParams.set("error", "google_callback_failed");
    return NextResponse.redirect(url);
  }

  const destination = getPostLoginPath(role, parsed.next);
  return NextResponse.redirect(`${origin}${destination}`);
}
