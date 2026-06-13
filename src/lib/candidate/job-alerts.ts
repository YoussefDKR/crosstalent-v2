import { createClient } from "@/lib/supabase/server";
import type { JobAlertRow } from "@/lib/candidate/job-alert-utils";

export type { JobAlertRow } from "@/lib/candidate/job-alert-utils";
export { jobAlertToFilters, hasAlertCriteria } from "@/lib/candidate/job-alert-utils";

export async function listJobAlerts(userId: string): Promise<JobAlertRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as JobAlertRow[];
}

export async function getJobAlert(
  userId: string,
  alertId: string
): Promise<JobAlertRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_alerts")
    .select("*")
    .eq("user_id", userId)
    .eq("id", alertId)
    .maybeSingle();

  if (error || !data) return null;
  return data as JobAlertRow;
}
