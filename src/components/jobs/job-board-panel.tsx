"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { JobBoardSearch } from "@/components/jobs/job-board-search";
import { JobListingCard } from "@/components/jobs/job-listing-card";
import { JOB_BOARD_PREVIEW_COUNT } from "@/config/jobs";
import { MarketingRevealItem } from "@/components/marketing/marketing-reveal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/i18n-provider";
import type { JobWithCompany } from "@/types/jobs";

type JobBoardPanelProps = {
  jobs: JobWithCompany[];
  listError?: string | null;
  hasActiveFilters: boolean;
  basePath?: string;
  savedJobIds?: Set<string>;
  alertsHref?: string;
};

export function JobBoardPanel({
  jobs,
  listError,
  hasActiveFilters,
  basePath = "/",
  savedJobIds,
  alertsHref = "/candidate/job-alerts",
}: JobBoardPanelProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const countLabel =
    jobs.length === 1
      ? t("jobs.jobFound", { count: jobs.length })
      : t("jobs.jobsFound", { count: jobs.length });

  const hasMore = jobs.length > JOB_BOARD_PREVIEW_COUNT;
  const visibleJobs = expanded
    ? jobs
    : jobs.slice(0, JOB_BOARD_PREVIEW_COUNT);
  const hiddenCount = jobs.length - JOB_BOARD_PREVIEW_COUNT;

  useEffect(() => {
    setExpanded(false);
  }, [jobs]);

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
        <Link
          href={alertsHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-2 shrink-0"
          )}
        >
          <Bell className="size-4" />
          {hasActiveFilters
            ? t("jobs.saveAlertFromFilters")
            : t("jobs.manageAlerts")}
        </Link>
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
        <>
          <ul className="space-y-4">
            {visibleJobs.map((job, index) => (
              <MarketingRevealItem key={job.id} index={index}>
                <JobListingCard job={job} savedJobIds={savedJobIds} />
              </MarketingRevealItem>
            ))}
          </ul>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5"
                onClick={() => setExpanded((open) => !open)}
              >
                {expanded ? (
                  <>
                    {t("jobs.showLess")}
                    <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    {t("jobs.seeMore", { count: hiddenCount })}
                    <ChevronDown className="size-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
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
