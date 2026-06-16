import { NextResponse } from "next/server";
import { recordSignupCountry } from "@/lib/auth/record-signup-country";
import { AUTH_ROUTES, getDashboardPath } from "@/lib/auth/routes";
import { getEmployerEntryPath } from "@/lib/employer/queries";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";
  const intentId = searchParams.get("intent");
  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  if (
    errorCode === "otp_expired" ||
    (authError === "access_denied" && errorCode === "otp_expired")
  ) {
    return NextResponse.redirect(
      `${origin}${AUTH_ROUTES.forgotPassword}?error=reset_link_expired`
    );
  }

  const supabase = await createClient();

  if (tokenHash && type === "recovery") {
    const recoverUrl = new URL(`${origin}${AUTH_ROUTES.recover}`);
    recoverUrl.searchParams.set("token_hash", tokenHash);
    return NextResponse.redirect(recoverUrl);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next.includes("reset-password")) {
        return NextResponse.redirect(`${origin}${AUTH_ROUTES.resetPassword}`);
      }

      if (intentId) {
        await supabase.rpc("apply_oauth_signup_role", {
          p_intent_id: intentId,
        });
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await recordSignupCountry(user.id);
        const role = await resolveUserRole(user.id);
        if (role) {
          const employerDestination =
            role === "employer" ? await getEmployerEntryPath(user.id) : null;
          const destination =
            next.startsWith(`/${role === "candidate" ? "candidate" : "employer"}`) ||
            (role === "candidate" && next === "/")
              ? next
              : employerDestination ?? getDashboardPath(role);
          return NextResponse.redirect(`${origin}${destination}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    if (next.includes("reset-password")) {
      return NextResponse.redirect(
        `${origin}${AUTH_ROUTES.forgotPassword}?error=reset_link_expired`
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
