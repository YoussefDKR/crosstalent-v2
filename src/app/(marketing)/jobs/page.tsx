import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { siteConfig } from "@/config/site";
import { listPublishedJobs, parseJobFilters } from "@/lib/jobs/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Job board",
  description: "Discover cross-border roles with European companies on CrossTalent",
};

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const filters = parseJobFilters(params);
  const { jobs, error: listError } = await listPublishedJobs(filters);
  const hasActiveFilters = Boolean(
    filters.q ||
      filters.country ||
      filters.employmentType ||
      filters.remoteType ||
      filters.experienceLevel ||
      filters.skill ||
      filters.salaryMin
  );

  return (
    <div className="bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Job board
          </h1>
          <p className="mt-3 text-muted-foreground">
            European opportunities for North African talent — filter by role,
            location, skills, and salary.
          </p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<div className="h-40 rounded-lg bg-white" />}>
            <JobFilters />
          </Suspense>
        </div>

        {listError && (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            {listError}
          </p>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "role" : "roles"} found
          {!hasActiveFilters && jobs.length === 0 && !listError && (
            <span className="block mt-1 text-[#0F172A]/70">
              Only jobs with status <strong>Published</strong> appear here. If
              you posted as an employer, edit the job and set status to
              Published, then save.
            </span>
          )}
        </p>

        {jobs.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-border bg-white p-12 text-center">
            <p className="font-medium text-[#0F172A]">
              {hasActiveFilters
                ? "No jobs match your filters"
                : "No published jobs yet"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Try adjusting filters or clear them to see all open roles."
                : "Employers must set a job to Published (not Draft) for it to show here."}
            </p>
            <Link
              href={siteConfig.links.candidateSignup}
              className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
            >
              Create a free candidate profile →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
