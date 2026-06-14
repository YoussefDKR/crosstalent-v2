"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import {
  openMessageFromApplication,
  updateApplicationStatus,
} from "@/app/applications/actions";
import { applicationStatusLabel } from "@/lib/applications/labels";
import { Button } from "@/components/ui/button";
import type { ApplicationStatus } from "@/types/applications";

type ApplicationActionsProps = {
  applicationId: string;
  status: ApplicationStatus;
  candidateName: string;
};

export function ApplicationActions({
  applicationId,
  status,
  candidateName,
}: ApplicationActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function runAction(
    action: () => Promise<{ error?: string; success?: string }>
  ) {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (result.success) {
        setMessage(result.success);
        router.refresh();
      }
    });
  }

  if (status === "accepted") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Status:{" "}
          <span className="font-medium text-emerald-700">
            {applicationStatusLabel(status)}
          </span>
        </p>
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              const result = await openMessageFromApplication(applicationId);
              if (result?.error) setMessage(result.error);
            });
          }}
          className="gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          <MessageSquare className="size-4" />
          Message {candidateName.split(" ")[0] ?? "candidate"}
        </Button>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <p className="text-sm text-muted-foreground">
        Status:{" "}
        <span className="font-medium text-[#0F172A]">
          {applicationStatusLabel(status)}
        </span>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            runAction(() =>
              updateApplicationStatus(applicationId, "accepted")
            )
          }
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Check className="size-4" />
          Accept
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() =>
            runAction(() =>
              updateApplicationStatus(applicationId, "rejected")
            )
          }
          className="gap-2 text-red-700 hover:bg-red-50"
        >
          <X className="size-4" />
          Decline
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Messaging unlocks after you accept this application.
      </p>
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
