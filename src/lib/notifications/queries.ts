import { getViewedApplicationIds } from "@/lib/applications/views";
import { listEmployerApplications } from "@/lib/applications/queries";
import { formatJobPostedAt } from "@/lib/jobs/format";
import { listConversationsForUser } from "@/lib/messaging/queries";
import {
  getConversationReadMap,
  isMessageUnread,
} from "@/lib/messaging/reads";
import { messagesThreadPath } from "@/lib/messaging/paths";
import type { AppNotification } from "@/types/notifications";
import type { Profile } from "@/types";

function truncate(text: string, max = 80): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export async function listAppNotifications(
  profile: Profile
): Promise<AppNotification[]> {
  const items: AppNotification[] = [];

  const conversations = await listConversationsForUser(profile);
  const readMap = await getConversationReadMap(
    profile.id,
    conversations.map((c) => c.id)
  );

  for (const conv of conversations) {
    const lastReadAt = readMap.get(conv.id) ?? null;
    const unread = isMessageUnread(
      conv.lastMessageAt,
      conv.lastMessageIsMine,
      lastReadAt
    );

    if (!unread || !conv.lastMessageBody) continue;

    items.push({
      id: `message-${conv.id}`,
      type: "message",
      title: `Message from ${conv.otherPartyName}`,
      body: truncate(conv.lastMessageBody),
      href: messagesThreadPath(profile.role, conv.id),
      createdAt: conv.lastMessageAt ?? conv.updatedAt,
      timeLabel: formatJobPostedAt(conv.lastMessageAt ?? conv.updatedAt),
    });
  }

  if (profile.role === "employer") {
    const applications = await listEmployerApplications(profile.id);
    const pending = applications.filter((a) => a.status === "pending");
    const viewedIds = await getViewedApplicationIds(
      profile.id,
      pending.map((a) => a.id)
    );

    for (const app of pending) {
      if (viewedIds.has(app.id)) continue;

      items.push({
        id: `application-${app.id}`,
        type: "application",
        title: "New application",
        body: `${app.candidateName} applied for ${app.jobTitle}`,
        href: `/employer/applications/${app.id}`,
        createdAt: app.createdAt,
        timeLabel: formatJobPostedAt(app.createdAt),
      });
    }
  }

  return items
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 25);
}
