"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatMessageTime } from "@/lib/messaging/format";
import type { MessageItem } from "@/types/messaging";
import { cn } from "@/lib/utils";

type MessageThreadProps = {
  conversationId: string;
  currentUserId: string;
  initialMessages: MessageItem[];
};

function toMessageItem(
  row: {
    id: string;
    conversation_id: string;
    sender_id: string;
    body: string;
    created_at: string;
  },
  currentUserId: string
): MessageItem {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
    isMine: row.sender_id === currentUserId,
  };
}

export function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
}: MessageThreadProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            body: string;
            created_at: string;
          };
          const next = toMessageItem(row, currentUserId);
          setMessages((prev) => {
            if (prev.some((m) => m.id === next.id)) return prev;
            return [...prev, next];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
        <p>No messages yet.</p>
        <p className="mt-1">Send the first message below.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex",
            msg.isMine ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm sm:max-w-[70%]",
              msg.isMine
                ? "rounded-br-md bg-[#2563EB] text-white"
                : "rounded-bl-md border border-border bg-white text-[#0F172A]"
            )}
          >
            <p className="whitespace-pre-wrap break-words">{msg.body}</p>
            <time
              dateTime={msg.createdAt}
              className={cn(
                "mt-1 block text-[10px]",
                msg.isMine ? "text-white/70" : "text-muted-foreground"
              )}
            >
              {formatMessageTime(msg.createdAt)}
            </time>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
