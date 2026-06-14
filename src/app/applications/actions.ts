"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentProfile } from "@/lib/auth/session";
import { findConversationWithCandidate } from "@/lib/messaging/queries";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/applications";

export type ApplicationActionResult = {
  error?: string;
  success?: string;
};

function revalidateApplicationPaths() {
  revalidatePath("/");
  revalidatePath("/employer/dashboard");
  revalidatePath("/jobs", "layout");
}

export async function applyToJob(
  jobId: string
): Promise<ApplicationActionResult> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") {
    return { error: "Sign in as a candidate to apply." };
  }

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status")
    .eq("id", jobId)
    .eq("status", "published")
    .maybeSingle();

  if (!job) {
    return { error: "This job is not open for applications." };
  }

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    candidate_id: profile.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You already applied to this job." };
    }
    return { error: error.message };
  }

  revalidateApplicationPaths();
  revalidatePath(`/jobs/${jobId}`);
  return { success: "Application submitted!" };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<ApplicationActionResult> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return { error: "Unauthorized." };
  }

  if (status !== "accepted" && status !== "rejected") {
    return { error: "Invalid status." };
  }

  const supabase = await createClient();

  const { data: app } = await supabase
    .from("job_applications")
    .select("id, job_id")
    .eq("id", applicationId)
    .maybeSingle();

  if (!app) return { error: "Application not found." };

  const { data: job } = await supabase
    .from("jobs")
    .select("employer_id")
    .eq("id", app.job_id)
    .maybeSingle();

  if (!job || job.employer_id !== profile.id) {
    return { error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) return { error: error.message };

  revalidateApplicationPaths();
  revalidatePath(`/employer/applications/${applicationId}`);
  return {
    success: status === "accepted" ? "Application accepted." : "Application declined.",
  };
}

export async function openMessageFromApplication(
  applicationId: string
): Promise<never | ApplicationActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "employer") {
      return { error: "Unauthorized." };
    }

    const supabase = await createClient();
    const { data: app } = await supabase
      .from("job_applications")
      .select("candidate_id, job_id, status")
      .eq("id", applicationId)
      .maybeSingle();

    if (!app) return { error: "Application not found." };

    if (app.status !== "accepted") {
      return {
        error: "Accept this application before messaging the candidate.",
      };
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("employer_id")
      .eq("id", app.job_id)
      .maybeSingle();

    if (!job || job.employer_id !== profile.id) {
      return { error: "Unauthorized." };
    }

    const existing = await findConversationWithCandidate(
      profile.id,
      app.candidate_id
    );

    if (existing) {
      redirect(`/employer/messages/${existing}`);
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        employer_id: profile.id,
        candidate_id: app.candidate_id,
        job_id: app.job_id,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        const retry = await findConversationWithCandidate(
          profile.id,
          app.candidate_id
        );
        if (retry) redirect(`/employer/messages/${retry}`);
      }
      return { error: error.message };
    }

    redirect(`/employer/messages/${data.id}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Something went wrong." };
  }
}
