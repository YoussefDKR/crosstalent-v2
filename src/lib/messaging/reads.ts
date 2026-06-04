import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const NOTIFICATION_REVALIDATE_PATHS = [
  "/employer/dashboard",
  "/employer/messages",
  "/employer/applications",
  "/candidate/dashboard",
  "/candidate/messages",
  "/",
];

function revalidateNotifications() {
  NOTIFICATION_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

export function isMessageUnread(
  lastMessageAt: string | null,
  lastMessageIsMine: boolean,
  lastReadAt: string | null
): boolean {
  if (!lastMessageAt || lastMessageIsMine) return false;
  if (!lastReadAt) return true;
  return new Date(lastMessageAt).getTime() > new Date(lastReadAt).getTime();
}

export async function getConversationReadMap(
  userId: string,
  conversationIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (conversationIds.length === 0) return map;

  const supabase = await createClient();
  const { data } = await supabase
    .from("conversation_reads")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId)
    .in("conversation_id", conversationIds);

  for (const row of data ?? []) {
    map.set(row.conversation_id, row.last_read_at);
  }

  return map;
}

export async function markConversationRead(
  conversationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("conversation_reads")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("conversation_reads")
      .update({ last_read_at: now })
      .eq("conversation_id", conversationId)
      .eq("user_id", userId);
  } else {
    await supabase.from("conversation_reads").insert({
      conversation_id: conversationId,
      user_id: userId,
      last_read_at: now,
    });
  }

  revalidateNotifications();
}
