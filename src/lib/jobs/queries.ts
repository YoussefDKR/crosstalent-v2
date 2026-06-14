import { createClient } from "@/lib/supabase/server";
import { isVisiblePublishedJob } from "@/lib/jobs/import-quality";
import type {
  EmploymentType,
  ExperienceLevel,
  JobFilters,
  JobRow,
  JobWithCompany,
  RemoteType,
} from "@/types/jobs";

function parseSkillsParam(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseJobFilters(
  params: Record<string, string | string[] | undefined>
): JobFilters {
  const get = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  const salaryMin = get("salaryMin");
  return {
    q: get("q"),
    country: get("country"),
    employmentType: get("employmentType") as EmploymentType | undefined,
    remoteType: get("remoteType") as RemoteType | undefined,
    experienceLevel: get("experienceLevel") as ExperienceLevel | undefined,
    skill: get("skill"),
    salaryMin: salaryMin ? Number(salaryMin) : undefined,
  };
}

type CompanySnippet = {
  user_id: string;
  company_name: string | null;
  logo_url: string | null;
  headquarters_country: string | null;
};

export async function attachCompanies(jobs: JobRow[]): Promise<JobWithCompany[]> {
  if (jobs.length === 0) return [];

  const supabase = await createClient();
  const employerIds = [
    ...new Set(
      jobs.map((j) => j.employer_id).filter((id): id is string => Boolean(id))
    ),
  ];

  const { data: companies } =
    employerIds.length > 0
      ? await supabase
          .from("company_profiles")
          .select("user_id, company_name, logo_url, headquarters_country")
          .in("user_id", employerIds)
      : { data: [] as CompanySnippet[] };

  const byEmployer = new Map(
    (companies ?? []).map((c) => [c.user_id, c as CompanySnippet])
  );

  return jobs.map((job) => {
    const company = job.employer_id
      ? byEmployer.get(job.employer_id)
      : undefined;
    return {
      ...job,
      company_name: job.rss_company_name ?? company?.company_name ?? null,
      company_logo_url: company?.logo_url ?? null,
      headquarters_country: company?.headquarters_country ?? null,
    };
  });
}

export type PublishedJobsResult = {
  jobs: JobWithCompany[];
  error?: string;
};

export async function listPublishedJobs(
  filters: JobFilters = {}
): Promise<PublishedJobsResult> {
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (filters.country) {
    query = query.eq("location_country", filters.country);
  }
  if (filters.employmentType) {
    query = query.eq("employment_type", filters.employmentType);
  }
  if (filters.remoteType) {
    query = query.eq("remote_type", filters.remoteType);
  }
  if (filters.experienceLevel) {
    query = query.eq("experience_level", filters.experienceLevel);
  }
  if (filters.skill) {
    query = query.contains("skills", [filters.skill]);
  }
  if (filters.salaryMin) {
    query = query.or(
      `salary_max.gte.${filters.salaryMin},salary_min.gte.${filters.salaryMin}`
    );
  }

  const { data, error } = await query;

  if (error) {
    return {
      jobs: [],
      error: error.message.includes("jobs")
        ? "Job board is not set up yet. Run migration 20250606000000_jobs.sql in Supabase."
        : error.message,
    };
  }

  if (!data) return { jobs: [] };

  const jobs = (data as JobRow[]).filter(isVisiblePublishedJob);

  if (filters.q) {
    const q = filters.q.toLowerCase();
    const withCompanies = await attachCompanies(jobs);
    return {
      jobs: withCompanies.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.company_name?.toLowerCase().includes(q) ?? false)
      ),
    };
  }

  return { jobs: await attachCompanies(jobs) };
}

export async function getPublishedJob(
  id: string
): Promise<JobWithCompany | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const [job] = await attachCompanies([data as JobRow]);
  return job ?? null;
}

export async function listEmployerJobs(
  employerId: string
): Promise<JobRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as JobRow[];
}

export async function getEmployerJob(
  employerId: string,
  jobId: string
): Promise<JobRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("employer_id", employerId)
    .maybeSingle();

  if (error || !data) return null;
  return data as JobRow;
}

export { parseSkillsParam };
