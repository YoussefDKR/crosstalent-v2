"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { locationLabel, statusLabel } from "@/lib/jobs/labels";
import type { JobRow } from "@/types/jobs";
import { JobStatusButtons } from "./job-status-buttons";

type EmployerJobsListProps = {
  jobs: JobRow[];
};

function statusVariant(
  status: JobRow["status"]
): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "closed") return "outline";
  return "secondary";
}

export function EmployerJobsList({ jobs }: EmployerJobsListProps) {
  const { t } = useI18n();

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">
          {t("employer.noJobPostsYet")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("employer.createFirstRole")}
        </p>
        <Link href="/employer/jobs/new" className="mt-6 inline-block">
          <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            {t("employer.postAJob")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-white shadow-sm">
      {jobs.map((job) => (
        <li
          key={job.id}
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[#0F172A]">{job.title}</h3>
              <Badge variant={statusVariant(job.status)}>
                {statusLabel(job.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {locationLabel(job.location_city, job.location_country)}
            </p>
            {job.status === "draft" && (
              <p className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
                {t("employer.draftNotOnBoard")}
              </p>
            )}
            {job.status === "published" && (
              <Link
                href={`/jobs/${job.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
              >
                {t("employer.viewOnJobBoard")}
                <ExternalLink className="size-3" />
              </Link>
            )}
          </div>
          <JobStatusButtons
            jobId={job.id}
            jobTitle={job.title}
            status={job.status}
          />
        </li>
      ))}
    </ul>
  );
}
