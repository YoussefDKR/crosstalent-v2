"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { formatMessageTime } from "@/lib/messaging/format";
import { messagesThreadPath } from "@/lib/messaging/paths";
import type { ConversationListItem } from "@/types/messaging";
import type { UserRole } from "@/types";

type ConversationListProps = {
  conversations: ConversationListItem[];
  role: UserRole;
};

export function ConversationList({
  conversations,
  role,
}: ConversationListProps) {
  const { messages } = useI18n();
  const m = messages.messaging;

  if (conversations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
        <MessageSquare className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-medium text-[#0F172A]">{m.noConversationsYet}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {role === "employer" ? m.emptyEmployer : m.emptyCandidate}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-white shadow-sm">
      {conversations.map((c) => (
        <li key={c.id}>
          <Link
            href={messagesThreadPath(role, c.id)}
            className="flex gap-4 p-5 transition-colors hover:bg-slate-50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
              <MessageSquare className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    {c.otherPartyName}
                  </p>
                  {c.otherPartySubtitle && (
                    <p className="text-xs text-muted-foreground">
                      {c.otherPartySubtitle}
                    </p>
                  )}
                </div>
                {c.lastMessageAt && (
                  <time
                    dateTime={c.lastMessageAt}
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    {formatMessageTime(c.lastMessageAt)}
                  </time>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {c.lastMessageBody
                  ? `${c.lastMessageIsMine ? m.youPrefix : ""}${c.lastMessageBody}`
                  : m.noMessagesYet}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
