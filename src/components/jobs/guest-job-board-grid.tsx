"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { JOB_BOARD_PREVIEW_COUNT } from "@/config/jobs";
import { MarketingRevealItem } from "@/components/marketing/marketing-reveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import type { JobWithCompany } from "@/types/jobs";

const PREVIEW_COUNT = JOB_BOARD_PREVIEW_COUNT;

type GuestJobBoardGridProps = {
  jobs: JobWithCompany[];
};

export function GuestJobBoardGrid({ jobs }: GuestJobBoardGridProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const hasMore = jobs.length > PREVIEW_COUNT;
  const visibleJobs = expanded ? jobs : jobs.slice(0, PREVIEW_COUNT);
  const hiddenCount = jobs.length - PREVIEW_COUNT;

  useEffect(() => {
    setExpanded(false);
  }, [jobs]);

  return (
    <>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {visibleJobs.map((job, index) => (
          <MarketingRevealItem key={job.id} index={index} as="div">
            <JobCard job={job} />
          </MarketingRevealItem>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
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
  );
}
