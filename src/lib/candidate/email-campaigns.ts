import { candidateEn } from "@/i18n/dictionaries/candidate/en";
import { BIO_MIN_LENGTH } from "@/config/candidate";
import { getCandidateProfileDataAdmin } from "@/lib/candidate/admin-profile-data";
import {
  calculateProfileCompletion,
  getIncompleteLabels,
} from "@/lib/candidate/completion";
import {
  jobAlertToFilters,
  type JobAlertRow,
} from "@/lib/candidate/job-alert-utils";
import { sendCandidateJobDigest } from "@/lib/email/send-candidate-job-digest";
import { sendCandidateProfileNudge } from "@/lib/email/send-candidate-profile-nudge";
import { jobMatchesFilters } from "@/lib/jobs/match-filters";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JobRow, JobWithCompany } from "@/types/jobs";

const PROFILE_THRESHOLD = 85;
const EMAIL_COOLDOWN_DAYS = 7;
const JOB_LOOKBACK_DAYS = 7;
const MAX_DIGEST_JOBS = 8;

export type CandidateEmailType = "profile_nudge" | "job_digest";

export type CandidateEmailCampaignSummary = {
  profileNudgesSent: number;
  jobDigestsSent: number;
  profileNudgesSkipped: number;
  jobDigestsSkipped: number;
  errors: string[];
};

type CandidateRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

function firstName(fullName: string | null | undefined): string {
  const trimmed = fullName?.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? "there";
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

async function wasEmailSentRecently(
  userId: string,
  emailType: CandidateEmailType
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("candidate_email_log")
    .select("id")
    .eq("user_id", userId)
    .eq("email_type", emailType)
    .gte("sent_at", daysAgo(EMAIL_COOLDOWN_DAYS))
    .limit(1);

  return Boolean(data?.length);
}

async function logEmailSent(
  userId: string,
  emailType: CandidateEmailType,
  recipientEmail: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("candidate_email_log").insert({
    user_id: userId,
    email_type: emailType,
    recipient_email: recipientEmail,
  });
}

async function attachCompaniesAdmin(jobs: JobRow[]): Promise<JobWithCompany[]> {
  if (jobs.length === 0) return [];

  const supabase = createAdminClient();
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
      : { data: [] };

  const byEmployer = new Map(
    (companies ?? []).map((c) => [c.user_id, c])
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

async function loadRecentJobs(): Promise<JobWithCompany[]> {
  const supabase = createAdminClient();
  const since = daysAgo(JOB_LOOKBACK_DAYS);

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .gte("published_at", since)
    .order("published_at", { ascending: false })
    .limit(100);

  if (error || !data?.length) return [];
  return attachCompaniesAdmin(data as JobRow[]);
}

function pickDigestJobs(
  recentJobs: JobWithCompany[],
  alerts: JobAlertRow[]
): { jobs: JobWithCompany[]; personalized: boolean } {
  const activeAlerts = alerts.filter((a) => a.is_active);
  if (activeAlerts.length > 0) {
    const matched: JobWithCompany[] = [];
    const seen = new Set<string>();

    for (const job of recentJobs) {
      if (matched.length >= MAX_DIGEST_JOBS) break;
      const fits = activeAlerts.some((alert) =>
        jobMatchesFilters(job, jobAlertToFilters(alert))
      );
      if (fits && !seen.has(job.id)) {
        seen.add(job.id);
        matched.push(job);
      }
    }

    if (matched.length > 0) {
      return { jobs: matched, personalized: true };
    }
  }

  return {
    jobs: recentJobs.slice(0, MAX_DIGEST_JOBS),
    personalized: false,
  };
}

export async function runCandidateEmailCampaigns(): Promise<CandidateEmailCampaignSummary> {
  const summary: CandidateEmailCampaignSummary = {
    profileNudgesSent: 0,
    jobDigestsSent: 0,
    profileNudgesSkipped: 0,
    jobDigestsSkipped: 0,
    errors: [],
  };

  const supabase = createAdminClient();
  const { data: candidates, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("role", "candidate")
    .eq("is_banned", false)
    .not("email", "is", null);

  if (error) {
    summary.errors.push(error.message);
    return summary;
  }

  const recentJobs = await loadRecentJobs();
  const completionItems = {
    ...candidateEn.completionItems,
    bio: candidateEn.completionItems.bio.replace(
      "{min}",
      String(BIO_MIN_LENGTH)
    ),
  };

  for (const row of (candidates ?? []) as CandidateRow[]) {
    const email = row.email?.trim().toLowerCase();
    if (!email) continue;

    const account = {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      avatarUrl: row.avatar_url,
    };

    try {
      const completion = calculateProfileCompletion(
        await getCandidateProfileDataAdmin(account),
        completionItems
      );

      if (
        completion.percent < PROFILE_THRESHOLD &&
        !(await wasEmailSentRecently(row.id, "profile_nudge"))
      ) {
        const result = await sendCandidateProfileNudge({
          toEmail: email,
          firstName: firstName(row.full_name),
          completionPercent: completion.percent,
          missingItems: getIncompleteLabels(completion),
        });

        if (result.ok) {
          await logEmailSent(row.id, "profile_nudge", email);
          summary.profileNudgesSent += 1;
        } else {
          summary.errors.push(`profile_nudge:${row.id}: ${result.error}`);
        }
      } else {
        summary.profileNudgesSkipped += 1;
      }
    } catch (err) {
      summary.errors.push(
        `profile_nudge:${row.id}: ${err instanceof Error ? err.message : "error"}`
      );
    }

    if (recentJobs.length === 0) {
      summary.jobDigestsSkipped += 1;
      continue;
    }

    try {
      if (await wasEmailSentRecently(row.id, "job_digest")) {
        summary.jobDigestsSkipped += 1;
        continue;
      }

      const { data: alerts } = await supabase
        .from("job_alerts")
        .select("*")
        .eq("user_id", row.id);

      const { jobs, personalized } = pickDigestJobs(
        recentJobs,
        (alerts ?? []) as JobAlertRow[]
      );

      if (jobs.length === 0) {
        summary.jobDigestsSkipped += 1;
        continue;
      }

      const result = await sendCandidateJobDigest({
        toEmail: email,
        firstName: firstName(row.full_name),
        jobs,
        personalized,
      });

      if (result.ok) {
        await logEmailSent(row.id, "job_digest", email);
        summary.jobDigestsSent += 1;
      } else {
        summary.errors.push(`job_digest:${row.id}: ${result.error}`);
      }
    } catch (err) {
      summary.errors.push(
        `job_digest:${row.id}: ${err instanceof Error ? err.message : "error"}`
      );
    }
  }

  return summary;
}
