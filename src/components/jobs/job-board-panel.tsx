"use client";

import { Suspense } from "react";
import { Bell } from "lucide-react";
import { JobBoardSearch } from "@/components/jobs/job-board-search";
import { JobListingCard } from "@/components/jobs/job-listing-card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import type { JobWithCompany } from "@/types/jobs";

type JobBoardPanelProps = {
  jobs: JobWithCompany[];
  listError?: string | null;
  hasActiveFilters: boolean;
  basePath?: string;
};

export function JobBoardPanel({
  jobs,
  listError,
  hasActiveFilters,
  basePath = "/",
}: JobBoardPanelProps) {
  const { t } = useI18n();

  const countLabel =
    jobs.length === 1
      ? t("jobs.jobFound", { count: jobs.length })
      : t("jobs.jobsFound", { count: jobs.length });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {t("jobs.boardTitle")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {t("jobs.boardSubtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2 shrink-0"
          disabled
          title={t("jobs.comingSoon")}
        >
          <Bell className="size-4" />
          {t("jobs.jobAlerts")}
        </Button>
      </div>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-white" />}>
        <JobBoardSearch basePath={basePath} />
      </Suspense>

      {listError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {listError}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{countLabel}</span>
        <label className="flex items-center gap-2">
          <span>{t("jobs.sortBy")}</span>
          <select
            className="rounded-lg border border-border bg-white px-2 py-1 text-sm text-[#0F172A]"
            defaultValue="recent"
            disabled
          >
            <option value="recent">{t("jobs.mostRecent")}</option>
          </select>
        </label>
      </div>

      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobListingCard job={job} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-medium text-[#0F172A]">
            {hasActiveFilters ? t("jobs.noMatch") : t("jobs.noPublished")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasActiveFilters ? t("jobs.tryDifferent") : t("jobs.checkBack")}
          </p>
        </div>
      )}
    </div>
  );
}
