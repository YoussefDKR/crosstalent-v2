import { listEmployerApplications } from "@/lib/applications/queries";
import { formatJobPostedAt } from "@/lib/jobs/format";
import { listEmployerJobs } from "@/lib/jobs/queries";
import { employmentLabel, remoteLabel } from "@/lib/jobs/labels";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/applications";
import type { EmploymentType, RemoteType } from "@/types/jobs";

export type EmployerDashboardStats = {
  activeJobs: number;
  totalApplications: number;
  shortlisted: number;
  inReview: number;
  applicationsGrowth: string | null;
};

export type EmployerRecentApplication = {
  id: string;
  candidateName: string;
  candidateAvatarUrl: string | null;
  jobTitle: string;
  status: ApplicationStatus;
  createdAt: string;
  postedLabel: string;
  languages: { language: string; proficiencyLabel: string }[];
};

export type EmployerTopJob = {
  jobId: string;
  title: string;
  subtitle: string;
  applications: number;
  shortlisted: number;
  hired: number;
  conversionPercent: number;
};

export type EmployerDashboardData = {
  stats: EmployerDashboardStats;
  recentApplications: EmployerRecentApplication[];
  topJob: EmployerTopJob | null;
};

const PROFICIENCY_LABEL: Record<string, string> = {
  basic: "A2",
  conversational: "B1",
  professional: "C1",
  native: "Native",
};

function growthLabel(current: number, previous: number): string | null {
  if (previous === 0) {
    if (current > 0) return "+100%";
    return null;
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return null;
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

async function applicationsSince(
  employerId: string,
  since: Date
): Promise<number> {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", employerId);

  if (!jobs?.length) return 0;

  const { count } = await supabase
    .from("job_applications")
    .select("id", { count: "exact", head: true })
    .in(
      "job_id",
      jobs.map((j) => j.id)
    )
    .gte("created_at", since.toISOString());

  return count ?? 0;
}

export async function getEmployerDashboardData(
  employerId: string
): Promise<EmployerDashboardData> {
  const jobs = await listEmployerJobs(employerId);
  const applications = await listEmployerApplications(employerId);

  const activeJobs = jobs.filter((j) => j.status === "published").length;
  const shortlisted = applications.filter((a) => a.status === "accepted").length;
  const inReview = applications.filter((a) => a.status === "pending").length;

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [recentMonth, priorMonth] = await Promise.all([
    applicationsSince(employerId, thirtyDaysAgo),
    applicationsSince(employerId, sixtyDaysAgo),
  ]);
  const priorPeriodOnly = Math.max(0, priorMonth - recentMonth);

  const stats: EmployerDashboardStats = {
    activeJobs,
    totalApplications: applications.length,
    shortlisted,
    inReview,
    applicationsGrowth: growthLabel(recentMonth, priorPeriodOnly),
  };

  const recentIds = applications.slice(0, 4).map((a) => a.candidateId);
  const languagesByCandidate = await fetchLanguagesByCandidate(recentIds);

  const recentApplications: EmployerRecentApplication[] = applications
    .slice(0, 4)
    .map((app) => ({
      id: app.id,
      candidateName: app.candidateName,
      candidateAvatarUrl: app.candidateAvatarUrl,
      jobTitle: app.jobTitle,
      status: app.status,
      createdAt: app.createdAt,
      postedLabel: formatJobPostedAt(app.createdAt),
      languages: languagesByCandidate.get(app.candidateId) ?? [],
    }));

  const topJob = buildTopJob(jobs, applications);

  return { stats, recentApplications, topJob };
}

async function fetchLanguagesByCandidate(
  candidateIds: string[]
): Promise<Map<string, { language: string; proficiencyLabel: string }[]>> {
  const map = new Map<string, { language: string; proficiencyLabel: string }[]>();
  if (candidateIds.length === 0) return map;

  const supabase = await createClient();
  const { data } = await supabase
    .from("candidate_languages")
    .select("user_id, language, proficiency")
    .in("user_id", candidateIds);

  for (const row of data ?? []) {
    const list = map.get(row.user_id) ?? [];
    list.push({
      language: row.language,
      proficiencyLabel:
        PROFICIENCY_LABEL[row.proficiency] ?? row.proficiency,
    });
    map.set(row.user_id, list);
  }

  return map;
}

function buildTopJob(
  jobs: Awaited<ReturnType<typeof listEmployerJobs>>,
  applications: Awaited<ReturnType<typeof listEmployerApplications>>
): EmployerTopJob | null {
  if (jobs.length === 0) return null;

  const byJob = new Map<
    string,
    { total: number; accepted: number; title: string }
  >();

  for (const app of applications) {
    const cur = byJob.get(app.jobId) ?? {
      total: 0,
      accepted: 0,
      title: app.jobTitle,
    };
    cur.total += 1;
    if (app.status === "accepted") cur.accepted += 1;
    byJob.set(app.jobId, cur);
  }

  let bestJobId: string | null = null;
  let bestTotal = -1;

  for (const [jobId, metrics] of byJob) {
    if (metrics.total > bestTotal) {
      bestTotal = metrics.total;
      bestJobId = jobId;
    }
  }

  if (!bestJobId || bestTotal === 0) {
    const published = jobs.find((j) => j.status === "published") ?? jobs[0];
    return {
      jobId: published.id,
      title: published.title,
      subtitle: jobSubtitle(
        published.remote_type,
        published.employment_type
      ),
      applications: 0,
      shortlisted: 0,
      hired: 0,
      conversionPercent: 0,
    };
  }

  const metrics = byJob.get(bestJobId)!;
  const job = jobs.find((j) => j.id === bestJobId)!;
  const conversionPercent =
    metrics.total > 0
      ? Math.round((metrics.accepted / metrics.total) * 1000) / 10
      : 0;

  return {
    jobId: bestJobId,
    title: job.title,
    subtitle: jobSubtitle(job.remote_type, job.employment_type),
    applications: metrics.total,
    shortlisted: metrics.accepted,
    hired: metrics.accepted,
    conversionPercent,
  };
}

function jobSubtitle(
  remoteType: RemoteType,
  employmentType: EmploymentType
): string {
  return `${remoteLabel(remoteType)} · ${employmentLabel(employmentType)}`;
}
