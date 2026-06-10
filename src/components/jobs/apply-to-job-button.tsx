"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { applyToJob } from "@/app/applications/actions";
import { applicationStatusLabel } from "@/lib/applications/labels";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
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
  const { t } = useI18n();

  if (applied && status) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#0F172A]">
        <CheckCircle2 className="size-5 text-emerald-600" />
        <span>
          {t("jobs.applicationSubmitted")}{" "}
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
            {t("jobs.submitting")}
          </>
        ) : (
          t("jobs.applyToJob")
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
  externalUrl?: string | null;
  externalSourceLabel?: string | null;
  application: {
    applied: boolean;
    status: ApplicationStatus | null;
  };
};

export function JobApplySection({
  jobId,
  isCandidate,
  externalUrl,
  externalSourceLabel,
  application,
}: JobApplySectionProps) {
  const { t } = useI18n();

  if (externalUrl) {
    return (
      <div className="mt-10 rounded-lg border border-amber-200/80 bg-amber-50/80 p-6">
        <p className="text-sm font-medium text-[#0F172A]">{t("jobs.curatedListing")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("jobs.curatedDesc", {
            source: externalSourceLabel ?? t("jobs.partnerBoard"),
          })}
        </p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block"
        >
          <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            {t("jobs.viewApplyExternally")}
          </Button>
        </a>
      </div>
    );
  }

  if (isCandidate) {
    return (
      <div className="mt-10 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-6">
        <p className="text-sm font-medium text-[#0F172A]">{t("jobs.readyToApply")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("jobs.submitProfile")}</p>
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
      <p className="text-sm text-[#0F172A]">{t("jobs.createProfilePrompt")}</p>
      <Link href={siteConfig.links.candidateSignup} className="mt-4 inline-block">
        <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
          {t("jobs.joinAsCandidate")}
        </Button>
      </Link>
    </div>
  );
}
