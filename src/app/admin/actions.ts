"use server";

import { revalidatePath } from "next/cache";
import { requireAdminProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JobStatus } from "@/types/jobs";

export type AdminActionResult = {
  error?: string;
  success?: string;
};

const ADMIN_PATHS = [
  "/admin/dashboard",
  "/admin/users",
  "/admin/jobs",
  "/admin/applications",
  "/jobs",
];

function revalidateAdminPaths() {
  ADMIN_PATHS.forEach((p) => revalidatePath(p));
  revalidatePath("/jobs", "layout");
}

function publishTimestamps(
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

async function setJobStatus(
  jobId: string,
  status: JobStatus
): Promise<AdminActionResult> {
  await requireAdminProfile();
  const supabase = createAdminClient();

  const { data: existing, error: fetchError } = await supabase
    .from("jobs")
    .select("published_at")
    .eq("id", jobId)
    .maybeSingle();

  if (fetchError || !existing) {
    return { error: fetchError?.message ?? "Job not found" };
  }

  const { published_at } = publishTimestamps(status, existing.published_at);
  const { error } = await supabase
    .from("jobs")
    .update({ status, published_at })
    .eq("id", jobId);

  if (error) return { error: error.message };

  revalidateAdminPaths();
  return { success: "Job updated" };
}

export async function adminPublishJob(
  jobId: string
): Promise<AdminActionResult> {
  return setJobStatus(jobId, "published");
}

export async function adminCloseJob(jobId: string): Promise<AdminActionResult> {
  return setJobStatus(jobId, "closed");
}

export async function adminDraftJob(jobId: string): Promise<AdminActionResult> {
  return setJobStatus(jobId, "draft");
}

export async function adminDeleteJob(
  jobId: string
): Promise<AdminActionResult> {
  await requireAdminProfile();
  const supabase = createAdminClient();

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) return { error: error.message };

  revalidateAdminPaths();
  return { success: "Job deleted" };
}
