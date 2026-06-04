"use client";

import { useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { startConversationWithCandidate } from "@/app/messaging/actions";
import { Button } from "@/components/ui/button";

type StartConversationButtonProps = {
  candidateId: string;
  candidateName: string;
};

export function StartConversationButton({
  candidateId,
  candidateName,
}: StartConversationButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await startConversationWithCandidate(candidateId);
      if (result?.error) alert(result.error);
    });
  }

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="w-full gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
    >
      <MessageSquare className="size-4" />
      {pending ? "Opening…" : `Message ${candidateName.split(" ")[0] ?? "candidate"}`}
    </Button>
  );
}
