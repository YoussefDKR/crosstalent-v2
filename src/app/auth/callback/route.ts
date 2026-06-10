import { NextResponse } from "next/server";
import { recordSignupCountry } from "@/lib/auth/record-signup-country";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/routes";
import { resolveUserRole } from "@/lib/auth/resolve-role";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const intentId = searchParams.get("intent");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
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
          const destination =
            next.startsWith(`/${role === "candidate" ? "candidate" : "employer"}`) ||
            (role === "candidate" && next === "/")
              ? next
              : getDashboardPath(role);
          return NextResponse.redirect(`${origin}${destination}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
