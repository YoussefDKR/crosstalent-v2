"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Archive, ExternalLink, Globe, Trash2 } from "lucide-react";
import {
  adminCloseJob,
  adminDeleteJob,
  adminDraftJob,
  adminPublishJob,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import type { JobStatus } from "@/types/jobs";

type AdminJobActionsProps = {
  jobId: string;
  status: JobStatus;
  sourceType: "platform" | "rss";
};

export function AdminJobActions({
  jobId,
  status,
  sourceType,
}: AdminJobActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  function confirmDelete() {
    if (
      !window.confirm(
        "Delete this job permanently? This cannot be undone."
      )
    ) {
      return;
    }
    run(() => adminDeleteJob(jobId));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "published" && (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={() => run(() => adminPublishJob(jobId))}
          className="gap-1.5 bg-[#10B981] text-white hover:bg-[#059669]"
        >
          <Globe className="size-3.5" />
          {pending ? "Saving…" : "Publish"}
        </Button>
      )}
      {status === "published" && (
        <>
          <Link href={`/jobs/${jobId}`} target="_blank">
            <Button type="button" size="sm" variant="outline" className="gap-1.5">
              <ExternalLink className="size-3.5" />
              View
            </Button>
          </Link>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => run(() => adminCloseJob(jobId))}
            className="gap-1.5"
          >
            <Archive className="size-3.5" />
            Close
          </Button>
        </>
      )}
      {status !== "draft" && sourceType === "platform" && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run(() => adminDraftJob(jobId))}
        >
          Move to draft
        </Button>
      )}
      {sourceType === "platform" && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={confirmDelete}
          className="gap-1.5 text-red-600 hover:text-red-700"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      )}
    </div>
  );
}
