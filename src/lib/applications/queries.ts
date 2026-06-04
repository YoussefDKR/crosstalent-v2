import { createClient } from "@/lib/supabase/server";
import type {
  ApplicationStatus,
  CandidateApplicationStatus,
  EmployerApplicationDetail,
  EmployerApplicationListItem,
} from "@/types/applications";

export async function getCandidateApplicationForJob(
  candidateId: string,
  jobId: string
): Promise<CandidateApplicationStatus> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("candidate_id", candidateId)
    .maybeSingle();

  if (!data) {
    return { applied: false, status: null, applicationId: null };
  }

  return {
    applied: true,
    status: data.status as ApplicationStatus,
    applicationId: data.id,
  };
}

export async function listEmployerApplications(
  employerId: string
): Promise<EmployerApplicationListItem[]> {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("employer_id", employerId);

  if (!jobs?.length) return [];

  const jobIds = jobs.map((j) => j.id);
  const jobTitleById = new Map(jobs.map((j) => [j.id, j.title]));

  const { data: applications, error } = await supabase
    .from("job_applications")
    .select("id, job_id, candidate_id, status, note, created_at")
    .in("job_id", jobIds)
    .order("created_at", { ascending: false });

  if (error || !applications?.length) return [];

  const candidateIds = [...new Set(applications.map((a) => a.candidate_id))];

  const [{ data: profiles }, { data: details }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .in("id", candidateIds),
    supabase
      .from("candidate_profiles")
      .select("user_id, headline")
      .in("user_id", candidateIds),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const headlineById = new Map(
    (details ?? []).map((d) => [d.user_id, d.headline])
  );

  return applications.map((row) => {
    const p = profileById.get(row.candidate_id);
    return {
      id: row.id,
      status: row.status as ApplicationStatus,
      createdAt: row.created_at,
      note: row.note,
      jobId: row.job_id,
      jobTitle: jobTitleById.get(row.job_id) ?? "Job",
      candidateId: row.candidate_id,
      candidateName: p?.full_name ?? p?.email ?? "Candidate",
      candidateHeadline: headlineById.get(row.candidate_id) ?? null,
      candidateAvatarUrl: p?.avatar_url ?? null,
    };
  });
}

export async function getEmployerApplication(
  employerId: string,
  applicationId: string
): Promise<EmployerApplicationDetail | null> {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("job_applications")
    .select("id, job_id, candidate_id, status, note, created_at")
    .eq("id", applicationId)
    .maybeSingle();

  if (error || !row) return null;

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, description, employer_id")
    .eq("id", row.job_id)
    .maybeSingle();

  if (!job || job.employer_id !== employerId) return null;

  const [{ data: profile }, { data: details }, { data: skills }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .eq("id", row.candidate_id)
        .maybeSingle(),
      supabase
        .from("candidate_profiles")
        .select("user_id, headline, bio, country_code")
        .eq("user_id", row.candidate_id)
        .maybeSingle(),
      supabase
        .from("candidate_skills")
        .select("name")
        .eq("user_id", row.candidate_id)
        .limit(8),
    ]);

  return {
    id: row.id,
    status: row.status as ApplicationStatus,
    createdAt: row.created_at,
    note: row.note,
    jobId: row.job_id,
    jobTitle: job.title,
    jobDescription: job.description,
    candidateId: row.candidate_id,
    candidateName: profile?.full_name ?? profile?.email ?? "Candidate",
    candidateHeadline: details?.headline ?? null,
    candidateAvatarUrl: profile?.avatar_url ?? null,
    candidateBio: details?.bio ?? null,
    candidateCountryCode: details?.country_code ?? null,
    candidateSkills: (skills ?? []).map((s) => s.name),
  };
}

