"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { adminSyncExternalJobs } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

export function AdminSyncJobsButton() {
  const { t } = useI18n();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const result = await adminSyncExternalJobs();
            setMessage(result.success ?? result.error ?? t("admin.errGeneric"));
          });
        }}
      >
        <RefreshCw
          className={`mr-2 size-4 ${isPending ? "animate-spin" : ""}`}
          aria-hidden
        />
        {isPending ? t("admin.syncJobsRunning") : t("admin.syncJobs")}
      </Button>
      {message && (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
