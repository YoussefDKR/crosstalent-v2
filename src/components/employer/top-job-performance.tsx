"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import type { EmployerTopJob } from "@/lib/employer/dashboard";

type TopJobPerformanceProps = {
  job: EmployerTopJob | null;
};

export function TopJobPerformance({ job }: TopJobPerformanceProps) {
  const { t } = useI18n();

  if (!job) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-white p-8 text-center shadow-sm">
        <p className="font-medium text-[#0F172A]">{t("employer.noJobPostsYet")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("employer.publishRoleHint")}
        </p>
        <Link href="/employer/jobs/new" className="mt-6 inline-block">
          <Button variant="brand">
            {t("employer.postNewJobLong")}
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-[#0F172A]">
        {t("employer.topJobPerformance")}
      </h2>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xl font-semibold text-[#0F172A]">{job.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{job.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-10">
          <div>
            <p className="text-2xl font-semibold tabular-nums text-[#0F172A]">
              {job.applications}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("employer.applications")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-[#0F172A]">
              {job.shortlisted}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("employer.shortlisted")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-[#0F172A]">
              {job.hired}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("employer.accepted")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-[#0F172A]">
              {job.conversionPercent}%
            </p>
            <p className="text-sm text-muted-foreground">
              {t("employer.conversion")}
            </p>
          </div>
        </div>
        <Link href={`/employer/jobs/${job.jobId}/edit`} className="shrink-0">
          <Button variant="outline">{t("employer.viewDetails")}</Button>
        </Link>
      </div>
    </section>
  );
}
