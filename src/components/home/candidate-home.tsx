import { Suspense } from "react";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { CandidateProfileSidebar } from "@/components/home/candidate-profile-sidebar";
import { listPublishedJobs, parseJobFilters } from "@/lib/jobs/queries";
import type { Profile } from "@/types";

type CandidateHomeProps = {
  profile: Profile;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function CandidateHome({
  profile,
  searchParams,
}: CandidateHomeProps) {
  const filters = parseJobFilters(searchParams);
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
    <div className="bg-slate-50/50 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(240px,280px)_1fr]">
          <aside>
            <CandidateProfileSidebar profile={profile} />
          </aside>

          <div className="min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Find your next role
              </h1>
              <p className="mt-2 text-muted-foreground">
                Browse European opportunities and apply in one click.
              </p>
            </div>

            <Suspense fallback={<div className="mb-6 h-40 rounded-lg bg-white" />}>
              <JobFilters basePath="/" />
            </Suspense>

            {listError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                {listError}
              </p>
            )}

            <p className="mb-4 text-sm text-muted-foreground">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"} found
            </p>

            {jobs.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
                <p className="font-medium text-[#0F172A]">
                  {hasActiveFilters
                    ? "No jobs match your filters"
                    : "No published jobs yet"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {hasActiveFilters
                    ? "Try adjusting filters or clear them."
                    : "Check back soon for new roles from European employers."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
