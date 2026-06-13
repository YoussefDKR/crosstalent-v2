import { createClient } from "@/lib/supabase/server";
import { attachCompanies } from "@/lib/jobs/queries";
import type { JobRow, JobWithCompany } from "@/types/jobs";

export async function getSavedJobIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId);

  if (error || !data) return new Set();
  return new Set(data.map((row) => row.job_id));
}

export async function listSavedJobs(userId: string): Promise<JobWithCompany[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return [];

  const jobIds = data.map((row) => row.job_id);
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*")
    .in("id", jobIds)
    .eq("status", "published");

  if (jobsError || !jobs?.length) return [];

  const byId = new Map((jobs as JobRow[]).map((job) => [job.id, job]));
  const ordered = jobIds
    .map((id) => byId.get(id))
    .filter((job): job is JobRow => Boolean(job));

  return attachCompanies(ordered);
}
