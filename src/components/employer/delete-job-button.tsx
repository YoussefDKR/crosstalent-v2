"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteJob } from "@/app/employer/jobs/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

type DeleteJobButtonProps = {
  jobId: string;
  jobTitle: string;
};

export function DeleteJobButton({ jobId, jobTitle }: DeleteJobButtonProps) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (
      !confirm(t("employer.deleteJob.confirm", { title: jobTitle }))
    ) {
      return;
    }
    startTransition(async () => {
      await deleteJob(jobId);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700"
      disabled={pending}
      onClick={handleDelete}
    >
      <Trash2 className="size-3.5" />
      {pending
        ? t("employer.deleteJob.deleting")
        : t("employer.deleteJob.delete")}
    </Button>
  );
}
