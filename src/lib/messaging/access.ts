import { createClient } from "@/lib/supabase/server";

/** True when employer and candidate have at least one accepted application. */
export async function hasAcceptedApplicationBetween(
  employerId: string,
  candidateId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id")
    .eq("employer_id", employerId);

  if (!jobs?.length) return false;

  const jobIds = jobs.map((j) => j.id);
  const { count } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("candidate_id", candidateId)
    .eq("status", "accepted")
    .in("job_id", jobIds);

  return (count ?? 0) > 0;
}
