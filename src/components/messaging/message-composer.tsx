"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage, type MessageActionResult } from "@/app/messaging/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initial: MessageActionResult = {};

type MessageComposerProps = {
  conversationId: string;
};

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const send = sendMessage.bind(null, conversationId);
  const [state, formAction, pending] = useActionState(send, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error && formRef.current) {
      formRef.current.reset();
    }
  }, [pending, state.error]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="border-t border-border bg-white p-4"
    >
      {state.error && (
        <p className="mb-2 text-sm text-red-600">{state.error}</p>
      )}
      <div className="flex gap-2">
        <Textarea
          name="body"
          placeholder="Write a message…"
          rows={2}
          required
          disabled={pending}
          className="min-h-[44px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <Button
          type="submit"
          disabled={pending}
          className="shrink-0 self-end bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Enter to send · Shift+Enter for new line
      </p>
    </form>
  );
}
