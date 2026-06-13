import { JobBoardPanel } from "@/components/jobs/job-board-panel";
import { getSavedJobIds } from "@/lib/candidate/saved-jobs";
import { listPublishedJobs, parseJobFilters } from "@/lib/jobs/queries";
import type { JobFilters } from "@/types/jobs";
import type { Profile } from "@/types";

type CandidateHomeProps = {
  profile: Profile;
  searchParams: Record<string, string | string[] | undefined>;
};

function filtersToQuery(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.employmentType) params.set("employmentType", filters.employmentType);
  if (filters.remoteType) params.set("remoteType", filters.remoteType);
  if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
  if (filters.skill) params.set("skill", filters.skill);
  if (filters.salaryMin) params.set("salaryMin", String(filters.salaryMin));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function CandidateHome({
  profile,
  searchParams,
}: CandidateHomeProps) {
  const filters = parseJobFilters(searchParams);
  const [{ jobs, error: listError }, savedJobIds] = await Promise.all([
    listPublishedJobs(filters),
    getSavedJobIds(profile.id),
  ]);

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
    <JobBoardPanel
      jobs={jobs}
      listError={listError}
      hasActiveFilters={hasActiveFilters}
      basePath="/"
      savedJobIds={savedJobIds}
      alertsHref={`/candidate/job-alerts${filtersToQuery(filters)}`}
    />
  );
}
