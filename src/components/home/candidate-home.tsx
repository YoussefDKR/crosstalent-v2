import { JobBoardPanel } from "@/components/jobs/job-board-panel";
import { listPublishedJobs, parseJobFilters } from "@/lib/jobs/queries";
import type { Profile } from "@/types";

type CandidateHomeProps = {
  profile: Profile;
  searchParams: Record<string, string | string[] | undefined>;
};

export async function CandidateHome({
  profile: _profile,
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
    <JobBoardPanel
      jobs={jobs}
      listError={listError}
      hasActiveFilters={hasActiveFilters}
      basePath="/"
    />
  );
}
