import { getDashboardPath } from "@/lib/auth/routes";
import type { UserRole } from "@/types";

function rolePathPrefix(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "employer") return "/employer";
  return "/candidate";
}

export function getPostLoginPath(
  role: UserRole,
  redirectTo?: string
): string {
  const prefix = rolePathPrefix(role);
  if (redirectTo && redirectTo.startsWith(prefix)) {
    return redirectTo;
  }
  if (role === "candidate" && redirectTo === "/") {
    return redirectTo;
  }
  return getDashboardPath(role);
}
