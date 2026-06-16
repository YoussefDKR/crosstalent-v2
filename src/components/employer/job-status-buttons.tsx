"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive, Globe, Pencil } from "lucide-react";
import Link from "next/link";
import {
  closeJob,
  moveJobToDraft,
  publishJob,
} from "@/app/employer/jobs/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import type { JobStatus } from "@/types/jobs";
import { DeleteJobButton } from "./delete-job-button";

type JobStatusButtonsProps = {
  jobId: string;
  jobTitle: string;
  status: JobStatus;
};

export function JobStatusButtons({
  jobId,
  jobTitle,
  status,
}: JobStatusButtonsProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ error?: string; success?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      {status === "draft" && (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => run(() => publishJob(jobId))}
          className="gap-1.5 bg-[#10B981] text-white hover:bg-[#059669]"
        >
          <Globe className="size-3.5" />
          {pending
            ? t("employer.jobButtons.posting")
            : t("employer.jobButtons.postJob")}
        </Button>
      )}
      {status === "published" && (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => closeJob(jobId))}
            className="gap-1.5"
          >
            <Archive className="size-3.5" />
            {t("employer.jobButtons.close")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => moveJobToDraft(jobId))}
          >
            {t("employer.jobButtons.moveToDraft")}
          </Button>
        </>
      )}
      {status === "closed" && (
        <>
          <Button
            type="button"
            size="sm"
            disabled={pending}
            onClick={() => run(() => publishJob(jobId))}
            variant="brand"
            className="gap-1.5"
          >
            <Globe className="size-3.5" />
            {t("employer.jobButtons.reopen")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => moveJobToDraft(jobId))}
          >
            {t("employer.jobButtons.moveToDraft")}
          </Button>
        </>
      )}
      <Link href={`/employer/jobs/${jobId}/edit`}>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          {t("employer.jobButtons.edit")}
        </Button>
      </Link>
      <DeleteJobButton jobId={jobId} jobTitle={jobTitle} />
    </div>
  );
}
