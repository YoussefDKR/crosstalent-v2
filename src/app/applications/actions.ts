"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentProfile } from "@/lib/auth/session";
import { canApplyToJobs, getApplyBlockers } from "@/lib/candidate/apply-readiness";
import { getCandidateProfileData } from "@/lib/candidate/queries";
import {
  sendApplicationAcceptedToCandidate,
  sendApplicationRejectedToCandidate,
  sendNewApplicationToEmployer,
} from "@/lib/email/send-application-emails";
import { findConversationWithCandidate } from "@/lib/messaging/queries";
import { attachCompanies } from "@/lib/jobs/queries";
import { createClient } from "@/lib/supabase/server";
import { getServerI18n } from "@/i18n/server";
import { siteConfig } from "@/config/site";
import type { JobRow } from "@/types/jobs";
import type { ApplicationStatus } from "@/types/applications";

export type ApplicationActionResult = {
  error?: string;
  success?: string;
};

function revalidateApplicationPaths() {
  revalidatePath("/");
  revalidatePath("/employer/dashboard");
  revalidatePath("/candidate/applications");
  revalidatePath("/jobs", "layout");
}

export async function applyToJob(
  jobId: string
): Promise<ApplicationActionResult> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") {
    return { error: "Sign in as a candidate to apply." };
  }

  const candidateData = await getCandidateProfileData(profile);
  if (!canApplyToJobs(candidateData)) {
    const { t } = await getServerI18n();
    const blockers = getApplyBlockers(candidateData);
    const labels = blockers.map((key) => t(`jobs.applyBlockers.${key}`));
    return {
      error: `${t("jobs.applyNotReady")} ${labels.join(", ")}.`,
    };
  }

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, status, employer_id")
    .eq("id", jobId)
    .eq("status", "published")
    .maybeSingle();

  if (!job) {
    return { error: "This job is not open for applications." };
  }

  const { data: inserted, error } = await supabase
    .from("job_applications")
    .insert({
      job_id: jobId,
      candidate_id: profile.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "You already applied to this job." };
    }
    return { error: error.message };
  }

  revalidateApplicationPaths();
  revalidatePath(`/jobs/${jobId}`);

  void notifyEmployerOfNewApplication({
    applicationId: inserted.id,
    jobId,
    jobTitle: job.title,
    employerId: job.employer_id,
    candidateName: profile.fullName ?? profile.email ?? "Candidate",
  });

  return { success: "Application submitted!" };
}

async function notifyEmployerOfNewApplication(payload: {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  employerId: string | null;
  candidateName: string;
}) {
  if (!payload.employerId) return;

  try {
    const supabase = await createClient();
    const { data: employer } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", payload.employerId)
      .maybeSingle();

    if (!employer?.email) return;

    const appUrl = siteConfig.url.replace(/\/$/, "");
    await sendNewApplicationToEmployer({
      toEmail: employer.email,
      userId: payload.employerId,
      employerName: employer.full_name ?? "there",
      candidateName: payload.candidateName,
      jobTitle: payload.jobTitle,
      applicationUrl: `${appUrl}${siteConfig.links.employerApplications}/${payload.applicationId}`,
    });
  } catch (e) {
    console.error("Failed to send new application email:", e);
  }
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
    .select("id, job_id, candidate_id")
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

  void notifyCandidateOfStatusChange({
    applicationId,
    candidateId: app.candidate_id,
    jobId: app.job_id,
    status,
  });

  return {
    success: status === "accepted" ? "Application accepted." : "Application declined.",
  };
}

async function notifyCandidateOfStatusChange(payload: {
  applicationId: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
}) {
  if (payload.status !== "accepted" && payload.status !== "rejected") return;

  try {
    const supabase = await createClient();

    const [{ data: candidate }, { data: jobRow }] = await Promise.all([
      supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", payload.candidateId)
        .maybeSingle(),
      supabase.from("jobs").select("*").eq("id", payload.jobId).maybeSingle(),
    ]);

    if (!candidate?.email || !jobRow) return;

    const [job] = await attachCompanies([jobRow as JobRow]);
    const appUrl = siteConfig.url.replace(/\/$/, "");
    const emailContent = {
      toEmail: candidate.email,
      userId: payload.candidateId,
      candidateName: candidate.full_name ?? candidate.email,
      jobTitle: job.title,
      companyName: job.company_name ?? "the employer",
      applicationsUrl: `${appUrl}/candidate/applications`,
    };

    if (payload.status === "accepted") {
      await sendApplicationAcceptedToCandidate(emailContent);
    } else {
      await sendApplicationRejectedToCandidate(emailContent);
    }
  } catch (e) {
    console.error("Failed to send application status email:", e);
  }
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
