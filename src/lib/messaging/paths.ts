export function messagesBasePath(role: "candidate" | "employer"): string {
  return role === "employer" ? "/employer/messages" : "/candidate/messages";
}

export function messagesThreadPath(
  role: "candidate" | "employer",
  conversationId: string
): string {
  return `${messagesBasePath(role)}/${conversationId}`;
}
