import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/routes";
import { resolveUserRole } from "@/lib/auth/resolve-role";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = await resolveUserRole(user.id);
        if (role) {
          return NextResponse.redirect(`${origin}${getDashboardPath(role)}`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
