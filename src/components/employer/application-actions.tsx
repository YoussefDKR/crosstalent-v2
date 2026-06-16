"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import {
  openMessageFromApplication,
  updateApplicationStatus,
} from "@/app/applications/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
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
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const statusText = t(`employer.applicationStatuses.${status}`);
  const firstName =
    candidateName.split(" ")[0] ??
    t("employer.applicationActions.messageFallback");

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
          {t("employer.applicationActions.status")}{" "}
          <span className="font-medium text-emerald-700">{statusText}</span>
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
          variant="brand"
          className="gap-2"
        >
          <MessageSquare className="size-4" />
          {t("employer.applicationActions.message", { name: firstName })}
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
        {t("employer.applicationActions.status")}{" "}
        <span className="font-medium text-[#0F172A]">{statusText}</span>
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
          {t("employer.applicationActions.accept")}
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
          {t("employer.applicationActions.decline")}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("employer.applicationActions.messagingUnlock")}
      </p>
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
