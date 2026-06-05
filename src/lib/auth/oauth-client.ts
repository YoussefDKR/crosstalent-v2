import { isBrandedGoogleOAuthEnabled } from "@/config/google-auth";
import { createClient } from "@/lib/supabase/client";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { getSiteUrl } from "@/lib/site-url";
import type { UserRole } from "@/types";

type GoogleSignInOptions = {
  redirectTo?: string;
  signupRole?: UserRole;
};

function buildCallbackUrl(intentId?: string, redirectTo?: string): string {
  const base = getSiteUrl();
  const params = new URLSearchParams();
  if (intentId) params.set("intent", intentId);
  if (redirectTo) params.set("next", redirectTo);
  const query = params.toString();
  return `${base}${AUTH_ROUTES.callback}${query ? `?${query}` : ""}`;
}

export async function createOAuthSignupIntent(
  role: UserRole
): Promise<{ intentId: string } | { error: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_oauth_signup_intent", {
    p_role: role,
  });

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "Could not start Google sign-up. Please try again." };
  }

  return { intentId: data as string };
}

export function getBrandedGoogleAuthPath(
  options: GoogleSignInOptions = {}
): string {
  const params = new URLSearchParams();
  if (options.signupRole) params.set("role", options.signupRole);
  if (options.redirectTo) params.set("next", options.redirectTo);
  const query = params.toString();
  return `/auth/google${query ? `?${query}` : ""}`;
}

export async function signInWithGoogle(
  options: GoogleSignInOptions = {}
): Promise<{ error: string } | void> {
  if (isBrandedGoogleOAuthEnabled()) {
    window.location.assign(getBrandedGoogleAuthPath(options));
    return;
  }

  const supabase = createClient();
  let intentId: string | undefined;

  if (options.signupRole) {
    const intent = await createOAuthSignupIntent(options.signupRole);
    if ("error" in intent) {
      return { error: intent.error };
    }
    intentId = intent.intentId;
  }

  const redirectTo = buildCallbackUrl(intentId, options.redirectTo);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "online",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }
}
