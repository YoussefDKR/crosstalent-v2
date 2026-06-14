import type { ParsedImportedJob } from "@/lib/jobs/import-types";
import {
  mapEmploymentType,
  parseDate,
  parseSkills,
  stripHtml,
} from "@/lib/jobs/import-helpers";
import { isLowQualityImportedListing } from "@/lib/jobs/import-quality";
import type { JobSourceConfig } from "@/lib/jobs/job-sources";

const DEFAULT_USER_AGENT = "CrossTalent/1.0 (+https://crosstalent.io)";

async function fetchJson(url: string, userAgent?: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent ?? DEFAULT_USER_AGENT },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function parseJobicyJob(job: Record<string, unknown>): ParsedImportedJob | null {
  const id = job.id;
  const url = typeof job.url === "string" ? job.url.trim() : "";
  if (!url || id === undefined || id === null) return null;

  const title = String(job.jobTitle ?? "Remote role").trim();
  const company = String(job.companyName ?? "Remote company").trim();

  const excerpt =
    typeof job.jobExcerpt === "string" ? stripHtml(job.jobExcerpt) : "";
  const fullDesc =
    typeof job.jobDescription === "string"
      ? stripHtml(job.jobDescription)
      : "";
  const description =
    (fullDesc || excerpt).slice(0, 12_000) || `${title} — apply on Jobicy.`;

  const jobType = Array.isArray(job.jobType)
    ? String(job.jobType[0] ?? "")
    : String(job.jobType ?? "");
  const geo =
    typeof job.jobGeo === "string" && job.jobGeo.trim()
      ? job.jobGeo.trim()
      : null;

  return {
    external_guid: `jobicy-${id}`,
    external_url: url,
    title,
    company,
    description,
    skills: parseSkills(job.jobIndustry),
    location_country: geo,
    location_city: null,
    published_at: parseDate(
      typeof job.pubDate === "string" ? job.pubDate : null
    ),
    employment_type: mapEmploymentType(jobType),
  };
}

function parseRemotiveJob(job: Record<string, unknown>): ParsedImportedJob | null {
  const id = job.id;
  const url = typeof job.url === "string" ? job.url.trim() : "";
  if (!url || id === undefined || id === null) return null;

  const title = String(job.title ?? "Remote role").trim();
  const company = String(job.company_name ?? "Remote company").trim();
  const description = stripHtml(String(job.description ?? "")).slice(0, 12_000);

  if (!description && !title) return null;

  const location =
    typeof job.candidate_required_location === "string" &&
    job.candidate_required_location.trim()
      ? job.candidate_required_location.trim()
      : null;

  const category =
    typeof job.category === "string" && job.category.trim()
      ? job.category.trim()
      : null;

  return {
    external_guid: `remotive-${id}`,
    external_url: url,
    title,
    company,
    description: description || `${title} — apply on Remotive.`,
    skills: category ? [category] : [],
    location_country: location,
    location_city: null,
    published_at: parseDate(
      typeof job.publication_date === "string" ? job.publication_date : null
    ),
    employment_type: mapEmploymentType(
      typeof job.job_type === "string" ? job.job_type : null
    ),
  };
}

function parseRemoteOkJob(job: Record<string, unknown>): ParsedImportedJob | null {
  const id = job.id;
  const url =
    (typeof job.url === "string" && job.url.trim()) ||
    (typeof job.apply_url === "string" && job.apply_url.trim()) ||
    "";
  if (!url || id === undefined || id === null) return null;

  const title = String(job.position ?? "Remote role").trim();
  const company = String(job.company ?? "Remote company").trim();
  const description = stripHtml(String(job.description ?? "")).slice(0, 12_000);

  if (!description && !title) return null;
  if (isLowQualityImportedListing(title, description)) return null;

  const location =
    typeof job.location === "string" && job.location.trim()
      ? job.location.trim().replace(/,\s*$/, "")
      : null;

  return {
    external_guid: `remoteok-${id}`,
    external_url: url,
    title,
    company,
    description: description || `${title} — apply on RemoteOK.`,
    skills: [],
    location_country: location,
    location_city: null,
    published_at: parseDate(typeof job.date === "string" ? job.date : null),
    employment_type: "full_time",
  };
}

export async function fetchJsonJobs(
  source: JobSourceConfig
): Promise<ParsedImportedJob[]> {
  const data = await fetchJson(source.url, source.userAgent);

  switch (source.id) {
    case "jobicy": {
      const jobs = Array.isArray((data as { jobs?: unknown }).jobs)
        ? ((data as { jobs: Record<string, unknown>[] }).jobs ?? [])
        : [];
      return jobs
        .map(parseJobicyJob)
        .filter((job): job is ParsedImportedJob => job !== null)
        .slice(0, source.maxItems);
    }
    case "remotive": {
      const jobs = Array.isArray((data as { jobs?: unknown }).jobs)
        ? ((data as { jobs: Record<string, unknown>[] }).jobs ?? [])
        : [];
      return jobs
        .map(parseRemotiveJob)
        .filter((job): job is ParsedImportedJob => job !== null)
        .slice(0, source.maxItems);
    }
    case "remoteok": {
      const jobs = Array.isArray(data)
        ? (data as Record<string, unknown>[]).slice(1)
        : [];
      return jobs
        .map(parseRemoteOkJob)
        .filter((job): job is ParsedImportedJob => job !== null)
        .slice(0, source.maxItems);
    }
    default:
      return [];
  }
}
