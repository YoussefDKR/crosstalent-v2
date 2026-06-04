import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  AUTH_ROUTES,
  getDashboardPath,
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

  if (!user) {
    if (isCandidatePath(pathname) || isEmployerPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = AUTH_ROUTES.login;
      url.searchParams.set("redirectTo", pathname);
      return redirectWithSession(url, supabaseResponse);
    }
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  let role = profile?.role as UserRole | undefined;

  if (!role) {
    const { data: ensured } = await supabase.rpc("ensure_user_profile");
    role = ensured?.role as UserRole | undefined;
  }

  if (isAuthPath(pathname) && role) {
    const url = request.nextUrl.clone();
    url.pathname = getDashboardPath(role);
    url.search = "";
    return redirectWithSession(url, supabaseResponse);
  }

  if (role) {
    if (isCandidatePath(pathname) && role !== "candidate") {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath("employer");
      return redirectWithSession(url, supabaseResponse);
    }
    if (isEmployerPath(pathname) && role !== "employer") {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath("candidate");
      return redirectWithSession(url, supabaseResponse);
    }
  }

  if (
    !isPublicPath(pathname) &&
    !isCandidatePath(pathname) &&
    !isEmployerPath(pathname)
  ) {
    if (role) {
      const url = request.nextUrl.clone();
      url.pathname = getDashboardPath(role);
      return redirectWithSession(url, supabaseResponse);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
