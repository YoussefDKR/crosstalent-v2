import { type NextRequest, NextResponse } from "next/server";
import { redirectApexToWww } from "@/lib/canonical-host";
import { updateSession } from "@/lib/supabase/middleware";
import {
  AUTH_ROUTES,
  EMPLOYER_ONBOARDING_PATH,
  getDashboardPath,
  isAdminPath,
  isAuthPath,
  isCandidatePath,
  isEmployerPath,
  isPublicPath,
} from "@/lib/auth/routes";
import type { UserRole } from "@/types";

function redirectWithSession(url: URL, sessionResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach(({ name, value }) => {
    redirectResponse.cookies.set(name, value);
  });
  return redirectResponse;
}

export async function middleware(request: NextRequest) {
  try {
    const wwwRedirect = redirectApexToWww(request);
    if (wwwRedirect) return wwwRedirect;

    const { supabaseResponse, user, supabase } = await updateSession(request);
    const { pathname } = request.nextUrl;

    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.includes(".")
    ) {
      return supabaseResponse;
    }

    if (!supabase) {
      return supabaseResponse;
    }

    if (!user) {
      if (
        isCandidatePath(pathname) ||
        isEmployerPath(pathname) ||
        isAdminPath(pathname)
      ) {
        const url = request.nextUrl.clone();
        url.pathname = AUTH_ROUTES.login;
        url.searchParams.set("redirectTo", pathname);
        return redirectWithSession(url, supabaseResponse);
      }
      return supabaseResponse;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", user.id)
      .maybeSingle();

    let role = profile?.role as UserRole | undefined;
    const isBanned = Boolean(profile?.is_banned);

    if (!role) {
      const { data: ensured } = await supabase.rpc("ensure_user_profile");
      role = ensured?.role as UserRole | undefined;
    }

    if (isBanned && pathname !== "/account/suspended" && pathname !== "/auth/signout") {
      const url = request.nextUrl.clone();
      url.pathname = "/account/suspended";
      url.search = "";
      return redirectWithSession(url, supabaseResponse);
    }

    if (isAuthPath(pathname) && role) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath(role);
      url.search = "";
      return redirectWithSession(url, supabaseResponse);
    }

    if (role) {
      if (isAdminPath(pathname) && role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = getDashboardPath(role);
        return redirectWithSession(url, supabaseResponse);
      }
      if (isCandidatePath(pathname) && role !== "candidate") {
        const url = request.nextUrl.clone();
        url.pathname = getDashboardPath(role);
        return redirectWithSession(url, supabaseResponse);
      }
      if (isEmployerPath(pathname) && role !== "employer") {
        const url = request.nextUrl.clone();
        url.pathname = getDashboardPath(role);
        return redirectWithSession(url, supabaseResponse);
      }

      if (
        role === "employer" &&
        isEmployerPath(pathname) &&
        pathname !== EMPLOYER_ONBOARDING_PATH
      ) {
        const { data: company } = await supabase
          .from("company_profiles")
          .select("company_name, website")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!company?.company_name?.trim() || !company?.website?.trim()) {
          const url = request.nextUrl.clone();
          url.pathname = EMPLOYER_ONBOARDING_PATH;
          return redirectWithSession(url, supabaseResponse);
        }
      }
    }

    if (
      !isPublicPath(pathname) &&
      !isCandidatePath(pathname) &&
      !isEmployerPath(pathname) &&
      !isAdminPath(pathname)
    ) {
      if (role) {
        const url = request.nextUrl.clone();
        url.pathname = getDashboardPath(role);
        return redirectWithSession(url, supabaseResponse);
      }
    }

    return supabaseResponse;
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
