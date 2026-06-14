"use client";

import { useEffect, useRef } from "react";
import { markConversationReadAction } from "@/app/messaging/actions";

type MarkConversationReadProps = {
  conversationId: string;
};

export function MarkConversationRead({ conversationId }: MarkConversationReadProps) {
  const marked = useRef(false);

  useEffect(() => {
    if (marked.current) return;
    marked.current = true;
    void markConversationReadAction(conversationId);
  }, [conversationId]);

  return null;
}
