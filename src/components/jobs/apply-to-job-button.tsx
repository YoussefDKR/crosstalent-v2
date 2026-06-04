"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { applyToJob } from "@/app/applications/actions";
import { applicationStatusLabel } from "@/lib/applications/labels";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { ApplicationStatus } from "@/types/applications";

type ApplyToJobButtonProps = {
  jobId: string;
  applied: boolean;
  status: ApplicationStatus | null;
};

export function ApplyToJobButton({
  jobId,
  applied,
  status,
}: ApplyToJobButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (applied && status) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
        <CheckCircle2 className="size-5 text-emerald-600" />
        <span>
          Application submitted —{" "}
          <span className="font-medium">{applicationStatusLabel(status)}</span>
        </span>
      </div>
    );
  }

  function handleApply() {
    setMessage(null);
    startTransition(async () => {
      const result = await applyToJob(jobId);
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

  return (
    <div className="space-y-3">
      <Button
        type="button"
        disabled={pending}
        onClick={handleApply}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Apply to this job"
        )}
      </Button>
      {message && (
        <p
          className={
            message.includes("submitted")
              ? "text-sm text-emerald-700"
              : "text-sm text-red-700"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

type JobApplySectionProps = {
  jobId: string;
  isCandidate: boolean;
  application: {
    applied: boolean;
    status: ApplicationStatus | null;
  };
};

export function JobApplySection({
  jobId,
  isCandidate,
  application,
}: JobApplySectionProps) {
  if (isCandidate) {
    return (
      <div className="mt-10 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-6">
        <p className="text-sm font-medium text-[#0F172A]">Ready to apply?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit your profile to the employer for this role.
        </p>
        <div className="mt-4">
          <ApplyToJobButton
            jobId={jobId}
            applied={application.applied}
            status={application.status}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-6">
      <p className="text-sm text-[#0F172A]">
        Ready to apply? Create your free candidate profile to connect with
        European employers.
      </p>
      <Link href={siteConfig.links.candidateSignup} className="mt-4 inline-block">
        <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
          Join as a candidate
        </Button>
      </Link>
    </div>
  );
}
