import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobBoardPanel } from "@/components/jobs/job-board-panel";
import { JobFilters } from "@/components/jobs/job-filters";
import { GuestJobBoardGrid } from "@/components/jobs/guest-job-board-grid";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { siteConfig } from "@/config/site";
import { getCurrentProfile } from "@/lib/auth/session";
import { getSavedJobIds } from "@/lib/candidate/saved-jobs";
import { listPublishedJobs, parseJobFilters } from "@/lib/jobs/queries";
import { getServerI18n } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("jobs.pageTitle"),
    description: t("jobs.pageSubtitle"),
  };
}

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const filters = parseJobFilters(params);
  const { jobs, error: listError } = await listPublishedJobs(filters);
  const profile = await getCurrentProfile();
  const { t } = await getServerI18n();

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.country ||
      filters.employmentType ||
      filters.remoteType ||
      filters.experienceLevel ||
      filters.skill ||
      filters.salaryMin
  );

  if (profile?.role === "candidate") {
    const savedJobIds = await getSavedJobIds(profile.id);
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.country) params.set("country", filters.country);
    if (filters.employmentType) params.set("employmentType", filters.employmentType);
    if (filters.remoteType) params.set("remoteType", filters.remoteType);
    if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
    if (filters.skill) params.set("skill", filters.skill);
    if (filters.salaryMin) params.set("salaryMin", String(filters.salaryMin));
    const query = params.toString();

    return (
      <JobBoardPanel
        jobs={jobs}
        listError={listError}
        hasActiveFilters={hasActiveFilters}
        basePath="/jobs"
        savedJobIds={savedJobIds}
        alertsHref={`/candidate/job-alerts${query ? `?${query}` : ""}`}
      />
    );
  }

  const countLabel =
    jobs.length === 1
      ? t("jobs.roleFound", { count: jobs.length })
      : t("jobs.rolesFound", { count: jobs.length });

  return (
    <>
      <MarketingPageHero
        align="center"
        title={t("jobs.pageTitle")}
        subtitle={t("jobs.pageSubtitleLong")}
      />

      <div className="bg-slate-50/80 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mt-2">
            <Suspense fallback={<div className="h-40 rounded-lg bg-white" />}>
              <JobFilters />
            </Suspense>
          </div>

          {listError && (
            <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
              {listError}
            </p>
          )}

          <p className="mt-6 text-sm text-muted-foreground">{countLabel}</p>

          {jobs.length > 0 ? (
            <GuestJobBoardGrid jobs={jobs} />
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-white p-12 text-center">
              <p className="font-medium text-[#0F172A]">
                {hasActiveFilters ? t("jobs.noMatch") : t("jobs.noListed")}
              </p>
              {!hasActiveFilters && (
                <p className="mt-2 text-sm text-muted-foreground">{t("jobs.rssHint")}</p>
              )}
              <Link
                href={siteConfig.links.candidateSignup}
                className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
              >
                {t("jobs.createProfile")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
