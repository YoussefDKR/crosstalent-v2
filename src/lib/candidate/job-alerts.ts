import { createClient } from "@/lib/supabase/server";
import type { EmploymentType, ExperienceLevel, JobFilters, RemoteType } from "@/types/jobs";

export type JobAlertRow = {
  id: string;
  user_id: string;
  name: string;
  q: string | null;
  country: string | null;
  employment_type: string | null;
  remote_type: string | null;
  experience_level: string | null;
  skill: string | null;
  salary_min: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function jobAlertToFilters(alert: JobAlertRow): JobFilters {
  return {
    q: alert.q ?? undefined,
    country: alert.country ?? undefined,
    employmentType: (alert.employment_type as EmploymentType | null) ?? undefined,
    remoteType: (alert.remote_type as RemoteType | null) ?? undefined,
    experienceLevel:
      (alert.experience_level as ExperienceLevel | null) ?? undefined,
    skill: alert.skill ?? undefined,
    salaryMin: alert.salary_min ?? undefined,
  };
}

export function hasAlertCriteria(alert: JobAlertRow): boolean {
  return Boolean(
    alert.q ||
      alert.country ||
      alert.employment_type ||
      alert.remote_type ||
      alert.experience_level ||
      alert.skill ||
      alert.salary_min
  );
}

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
