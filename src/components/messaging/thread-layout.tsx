import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MessageComposer } from "@/components/messaging/message-composer";
import { MarkConversationRead } from "@/components/messaging/mark-conversation-read";
import { MessageThread } from "@/components/messaging/message-thread";
import { messagesBasePath } from "@/lib/messaging/paths";
import type { ConversationThread } from "@/types/messaging";
import type { Profile } from "@/types";

type ThreadLayoutProps = {
  profile: Profile;
  thread: ConversationThread;
};

export function ThreadLayout({ profile, thread }: ThreadLayoutProps) {
  return (
    <div className="flex min-h-[min(70vh,640px)] flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm">
      <MarkConversationRead conversationId={thread.id} />
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <Link
          href={messagesBasePath(profile.role)}
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
        >
          <ArrowLeft className="size-4" />
          All messages
        </Link>
        <h2 className="text-lg font-semibold text-[#0F172A]">
          {thread.otherPartyName}
        </h2>
        {thread.otherPartySubtitle && (
          <p className="text-sm text-muted-foreground">
            {thread.otherPartySubtitle}
          </p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <MessageThread
          conversationId={thread.id}
          currentUserId={profile.id}
          initialMessages={thread.messages}
        />
      </div>

      <MessageComposer conversationId={thread.id} />
    </div>
  );
}
