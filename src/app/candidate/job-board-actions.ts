"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type {
  EmploymentType,
  ExperienceLevel,
  RemoteType,
} from "@/types/jobs";

export type CandidateJobActionResult = {
  error?: string;
  success?: string;
  saved?: boolean;
};

const CANDIDATE_JOB_PATHS = [
  "/",
  "/jobs",
  "/candidate/saved-jobs",
  "/candidate/job-alerts",
];

function revalidateCandidateJobs() {
  for (const path of CANDIDATE_JOB_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/jobs", "layout");
}

async function requireCandidateId(): Promise<string> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") {
    throw new Error("Unauthorized");
  }
  return profile.id;
}

export async function toggleSavedJob(
  jobId: string
): Promise<CandidateJobActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("user_id", userId)
        .eq("job_id", jobId);
      if (error) return { error: error.message };
      revalidateCandidateJobs();
      return { success: "Removed from saved jobs", saved: false };
    }

    const { error } = await supabase.from("saved_jobs").insert({
      user_id: userId,
      job_id: jobId,
    });
    if (error) return { error: error.message };

    revalidateCandidateJobs();
    return { success: "Job saved", saved: true };
  } catch {
    return { error: "Sign in as a candidate to save jobs." };
  }
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const v = String(value ?? "").trim();
  return v || null;
}

function optionalInt(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function createJobAlert(
  _prev: CandidateJobActionResult,
  formData: FormData
): Promise<CandidateJobActionResult> {
  try {
    const userId = await requireCandidateId();
    const name = String(formData.get("name") ?? "").trim() || "My alert";
    const payload = {
      user_id: userId,
      name,
      q: optionalString(formData.get("q")),
      country: optionalString(formData.get("country")),
      employment_type: optionalString(formData.get("employmentType")),
      remote_type: optionalString(formData.get("remoteType")),
      experience_level: optionalString(formData.get("experienceLevel")),
      skill: optionalString(formData.get("skill")),
      salary_min: optionalInt(formData.get("salaryMin")),
      is_active: true,
    };

    if (
      !payload.q &&
      !payload.country &&
      !payload.employment_type &&
      !payload.remote_type &&
      !payload.experience_level &&
      !payload.skill &&
      !payload.salary_min
    ) {
      return { error: "Add at least one filter for your alert." };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("job_alerts").insert(payload);
    if (error) return { error: error.message };

    revalidateCandidateJobs();
    return { success: "Job alert created" };
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function deleteJobAlert(
  alertId: string
): Promise<CandidateJobActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("job_alerts")
      .delete()
      .eq("id", alertId)
      .eq("user_id", userId);
    if (error) return { error: error.message };

    revalidateCandidateJobs();
    return { success: "Alert deleted" };
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function toggleJobAlertActive(
  alertId: string,
  isActive: boolean
): Promise<CandidateJobActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("job_alerts")
      .update({ is_active: isActive })
      .eq("id", alertId)
      .eq("user_id", userId);
    if (error) return { error: error.message };

    revalidateCandidateJobs();
    return { success: isActive ? "Alert enabled" : "Alert paused" };
  } catch {
    return { error: "Unauthorized" };
  }
}

export async function createJobAlertFromFilters(
  filters: {
    q?: string;
    country?: string;
    employmentType?: EmploymentType;
    remoteType?: RemoteType;
    experienceLevel?: ExperienceLevel;
    skill?: string;
    salaryMin?: number;
  },
  name?: string
): Promise<CandidateJobActionResult> {
  try {
    const userId = await requireCandidateId();
    if (
      !filters.q &&
      !filters.country &&
      !filters.employmentType &&
      !filters.remoteType &&
      !filters.experienceLevel &&
      !filters.skill &&
      !filters.salaryMin
    ) {
      return { error: "Apply filters on the job board first, then save an alert." };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("job_alerts").insert({
      user_id: userId,
      name: name?.trim() || "Board filters",
      q: filters.q ?? null,
      country: filters.country ?? null,
      employment_type: filters.employmentType ?? null,
      remote_type: filters.remoteType ?? null,
      experience_level: filters.experienceLevel ?? null,
      skill: filters.skill ?? null,
      salary_min: filters.salaryMin ?? null,
      is_active: true,
    });
    if (error) return { error: error.message };

    revalidateCandidateJobs();
    return { success: "Alert saved from current filters" };
  } catch {
    return { error: "Unauthorized" };
  }
}
