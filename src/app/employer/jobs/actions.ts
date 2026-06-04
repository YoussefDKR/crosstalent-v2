"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { parseSkillsParam } from "@/lib/jobs/queries";
import { createClient } from "@/lib/supabase/server";
import type { JobStatus } from "@/types/jobs";

export type JobActionResult = {
  error?: string;
  success?: string;
};

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

function jobPayloadWithPublishTime(
  payload: ReturnType<typeof parseJobForm>
): ReturnType<typeof parseJobForm> & { published_at?: string | null } {
  if (payload.status === "published") {
    return { ...payload, published_at: new Date().toISOString() };
  }
  if (payload.status === "draft") {
    return { ...payload, published_at: null };
  }
  return payload;
}

function parseJobForm(formData: FormData) {
  const status = String(formData.get("status") ?? "draft") as JobStatus;
  const validStatuses: JobStatus[] = ["draft", "published", "closed"];

  return {
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
    status: validStatuses.includes(status) ? status : "draft",
  };
}

export async function createJob(
  _prev: JobActionResult,
  formData: FormData
): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const payload = jobPayloadWithPublishTime(parseJobForm(formData));

    if (!payload.title || !payload.description) {
      return { error: "Title and description are required." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .insert({ ...payload, employer_id: employerId })
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
    const payload = jobPayloadWithPublishTime(parseJobForm(formData));

    if (!payload.title || !payload.description) {
      return { error: "Title and description are required." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("jobs")
      .update(payload)
      .eq("id", jobId)
      .eq("employer_id", employerId);

    if (error) return { error: error.message };

    revalidateJobPaths();
    return { success: "Job saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function publishJob(jobId: string): Promise<JobActionResult> {
  try {
    const employerId = await requireEmployerId();
    const supabase = await createClient();

    const { error } = await supabase
      .from("jobs")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("employer_id", employerId);

    if (error) return { error: error.message };

    revalidateJobPaths();
    return { success: "Job is now live on the job board." };
  } catch {
    return { error: "Something went wrong." };
  }
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
