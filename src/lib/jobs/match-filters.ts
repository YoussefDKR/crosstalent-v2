import type { JobFilters, JobRow, JobWithCompany } from "@/types/jobs";

export function jobMatchesFilters(
  job: JobRow | JobWithCompany,
  filters: JobFilters
): boolean {
  if (filters.country && job.location_country !== filters.country) {
    return false;
  }
  if (filters.employmentType && job.employment_type !== filters.employmentType) {
    return false;
  }
  if (filters.remoteType && job.remote_type !== filters.remoteType) {
    return false;
  }
  if (filters.experienceLevel && job.experience_level !== filters.experienceLevel) {
    return false;
  }
  if (filters.skill && !job.skills.includes(filters.skill)) {
    return false;
  }
  if (filters.salaryMin) {
    const meets =
      (job.salary_max !== null && job.salary_max >= filters.salaryMin) ||
      (job.salary_min !== null && job.salary_min >= filters.salaryMin);
    if (!meets) return false;
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    const company =
      "company_name" in job && typeof job.company_name === "string"
        ? job.company_name
        : job.rss_company_name;
    const haystack = [
      job.title,
      job.description,
      company ?? "",
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}
