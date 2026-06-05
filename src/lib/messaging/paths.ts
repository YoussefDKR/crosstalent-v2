import type { UserRole } from "@/types";

export function messagesBasePath(role: UserRole): string {
  if (role === "employer") return "/employer/messages";
  if (role === "admin") return "/admin/dashboard";
  return "/candidate/messages";
}

export function messagesThreadPath(
  role: UserRole,
  conversationId: string
): string {
  if (role === "admin") return "/admin/dashboard";
  return `${messagesBasePath(role)}/${conversationId}`;
}
