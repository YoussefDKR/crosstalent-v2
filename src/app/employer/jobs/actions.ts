"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import {
  getEmployerFeatureAccess,
  publishBlockedMessage,
} from "@/lib/billing/access";
import { getCurrentProfile } from "@/lib/auth/session";
import { parseSkillsParam } from "@/lib/jobs/queries";
import { createClient } from "@/lib/supabase/server";
import type { JobStatus } from "@/types/jobs";

export type JobActionResult = {
  error?: string;
  success?: string;
};

export type JobFormIntent =
  | "draft"
  | "publish"
  | "save"
  | "close"
  | "reopen";

const EMPLOYER_JOB_PATHS = ["/employer/jobs", "/employer/dashboard", "/jobs"];

function revalidateJobPaths() {
  EMPLOYER_JOB_PATHS.forEach((p) => revalidatePath(p));
  revalidatePath("/jobs", "layout");
}

async function requireEmployerId(): Promise<string> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    throw new Error("Unauthorized");
  }
  return profile.id;
}

async function publishGuard(
  employerId: string,
  nextStatus: JobStatus,
  currentStatus?: JobStatus
): Promise<JobActionResult | null> {
  if (nextStatus !== "published" || currentStatus === "published") {
    return null;
  }
  const access = await getEmployerFeatureAccess(employerId);
  if (!access.canPublishJobs) {
    return { error: publishBlockedMessage(access) };
  }
  return null;
}

function resolveJobStatus(
  intent: JobFormIntent,
  currentStatus: JobStatus
): JobStatus {
  switch (intent) {
    case "publish":
    case "reopen":
      return "published";
    case "draft":
      return "draft";
    case "close":
      return "closed";
    case "save":
    default:
      return currentStatus;
  }
}

function applyPublishTimestamps(
  status: JobStatus,
  existingPublishedAt: string | null
): { status: JobStatus; published_at: string | null } {
  if (status === "published") {
    return {
      status,
      published_at: existingPublishedAt ?? new Date().toISOString(),
    };
  }
  if (status === "draft") {
    return { status, published_at: null };
  }
  return { status, published_at: existingPublishedAt };
}

function parseJobForm(formData: FormData, currentStatus: JobStatus = "draft") {
  const intent = String(formData.get("intent") ?? "draft") as JobFormIntent;
  const validIntents: JobFormIntent[] = [
    "draft",
    "publish",
    "save",
    "close",
    "reopen",
  ];
  const resolvedIntent = validIntents.includes(intent) ? intent : "draft";
  const status = resolveJobStatus(resolvedIntent, currentStatus);

  return {
    intent: resolvedIntent,
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    requirements: String(formData.get("requirements") ?? "").trim() || null,
    employment_type: String(formData.get("employmentType") ?? "full_time"),
    experience_level: String(formData.get("experienceLevel") ?? "mid"),
    remote_type: String(formData.get("remoteType") ?? "hybrid"),
    location_city: String(formData.get("locationCity") ?? "").trim() || null,
    location_country:
      String(formData.get("locationCountry") ?? "").trim() || null,
    salary_min: formData.get("salaryMin")
      ? Number(formData.get("salaryMin"))
      : null,
    salary_max: formData.get("salaryMax")
      ? Number(formData.get("salaryMax"))
      : null,
    salary_currency: String(formData.get("salaryCurrency") ?? "EUR").trim(),
    skills: parseSkillsParam(String(formData.get("skills") ?? "")),
    languages: parseSkillsParam(String(formData.get("languages") ?? "")),
    status,
  };
}

export async function createJob(
  _prev: JobActionResult,
  formData: FormData
): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const parsed = parseJobForm(formData, "draft");

    if (!parsed.title || !parsed.description) {
      return { error: "Title and description are required." };
    }

    const status =
      parsed.intent === "publish" ? "published" : "draft";
    const blocked = await publishGuard(employerId, status);
    if (blocked) return blocked;

    const { published_at } = applyPublishTimestamps(status, null);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        employer_id: employerId,
        title: parsed.title,
        description: parsed.description,
        requirements: parsed.requirements,
        employment_type: parsed.employment_type,
        experience_level: parsed.experience_level,
        remote_type: parsed.remote_type,
        location_city: parsed.location_city,
        location_country: parsed.location_country,
        salary_min: parsed.salary_min,
        salary_max: parsed.salary_max,
        salary_currency: parsed.salary_currency,
        skills: parsed.skills,
        languages: parsed.languages,
        status,
        published_at,
      })
      .select("id")
      .single();

    if (error) return { error: error.message };

    revalidateJobPaths();
    redirect(`/employer/jobs/${data.id}/edit?created=1`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Something went wrong." };
  }
}

export async function updateJob(
  jobId: string,
  _prev: JobActionResult,
  formData: FormData
): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
      .from("jobs")
      .select("status, published_at")
      .eq("id", jobId)
      .eq("employer_id", employerId)
      .maybeSingle();

    if (fetchError || !existing) {
      return { error: "Job not found." };
    }

    const parsed = parseJobForm(
      formData,
      existing.status as JobStatus
    );

    if (!parsed.title || !parsed.description) {
      return { error: "Title and description are required." };
    }

    const blocked = await publishGuard(
      employerId,
      parsed.status,
      existing.status as JobStatus
    );
    if (blocked) return blocked;

    const { published_at } = applyPublishTimestamps(
      parsed.status,
      existing.published_at
    );

    const { error } = await supabase
      .from("jobs")
      .update({
        title: parsed.title,
        description: parsed.description,
        requirements: parsed.requirements,
        employment_type: parsed.employment_type,
        experience_level: parsed.experience_level,
        remote_type: parsed.remote_type,
        location_city: parsed.location_city,
        location_country: parsed.location_country,
        salary_min: parsed.salary_min,
        salary_max: parsed.salary_max,
        salary_currency: parsed.salary_currency,
        skills: parsed.skills,
        languages: parsed.languages,
        status: parsed.status,
        published_at,
      })
      .eq("id", jobId)
      .eq("employer_id", employerId);

    if (error) return { error: error.message };

    revalidateJobPaths();

    if (parsed.intent === "publish" || parsed.intent === "reopen") {
      return { success: "Job is live on the job board." };
    }
    if (parsed.intent === "close") {
      return { success: "Job marked as closed." };
    }
    if (parsed.intent === "draft") {
      return { success: "Job moved to draft." };
    }
    return { success: "Job saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}

async function setJobStatus(
  jobId: string,
  status: JobStatus
): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("jobs")
      .select("published_at, status")
      .eq("id", jobId)
      .eq("employer_id", employerId)
      .maybeSingle();

    if (!existing) return { error: "Job not found." };

    const blocked = await publishGuard(
      employerId,
      status,
      existing.status as JobStatus
    );
    if (blocked) return blocked;

    const { published_at } = applyPublishTimestamps(
      status,
      existing.published_at
    );

    const { error } = await supabase
      .from("jobs")
      .update({ status, published_at })
      .eq("id", jobId)
      .eq("employer_id", employerId);

    if (error) return { error: error.message };

    revalidateJobPaths();
    return { success: "Job updated." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function publishJob(jobId: string): Promise<JobActionResult> {
  const result = await setJobStatus(jobId, "published");
  if (result.success) return { success: "Job is now live on the job board." };
  return result;
}

export async function closeJob(jobId: string): Promise<JobActionResult> {
  const result = await setJobStatus(jobId, "closed");
  if (result.success) return { success: "Job closed." };
  return result;
}

export async function moveJobToDraft(jobId: string): Promise<JobActionResult> {
  const result = await setJobStatus(jobId, "draft");
  if (result.success) return { success: "Job moved to draft." };
  return result;
}

export async function deleteJob(jobId: string): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const supabase = await createClient();

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .eq("employer_id", employerId);

    if (error) return { error: error.message };

    revalidateJobPaths();
    redirect("/employer/jobs");
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Something went wrong." };
  }
}
