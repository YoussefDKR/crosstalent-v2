import type { UserRole } from "@/types";

export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  callback: "/auth/callback",
  signOut: "/auth/signout",
} as const;

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  candidate: "/",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

export const PUBLIC_PATH_PREFIXES = [
  "/",
  "/login",
  "/signup",
  "/auth/callback",
  "/auth/google",
  "/pricing",
  "/why-crosstalent",
  "/for-employers",
  "/for-candidates",
  "/jobs",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/account/delete",
  "/docs",
] as const;

export function getDashboardPath(role: UserRole): string {
  return DASHBOARD_ROUTES[role] ?? "/login";
}

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth/callback")) return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => prefix !== "/" && pathname.startsWith(prefix)
  );
}

export function isAuthPath(pathname: string): boolean {
  return pathname === AUTH_ROUTES.login || pathname === AUTH_ROUTES.signup;
}

export function isCandidatePath(pathname: string): boolean {
  return pathname.startsWith("/candidate");
}

export function isEmployerPath(pathname: string): boolean {
  return pathname.startsWith("/employer");
}

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export function parseSignupRole(
  value: string | null | undefined
): UserRole | null {
  if (value === "candidate" || value === "employer") return value;
  return null;
}

export function resolveSignupDefaultRole(
  roleParam: string | undefined
): UserRole {
  return parseSignupRole(roleParam) ?? "candidate";
}
