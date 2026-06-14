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
  "/admin/subscriptions",
  "/admin/settings",
  "/jobs",
];

function revalidateAdminPaths() {
  ADMIN_PATHS.forEach((p) => revalidatePath(p));
  revalidatePath("/jobs", "layout");
}

function revalidateUserProfile(userId: string) {
  revalidateAdminPaths();
  revalidatePath(`/admin/users/${userId}`);
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

async function assertCanModerateUser(
  targetUserId: string
): Promise<AdminActionResult | null> {
  const admin = await requireAdminProfile();
  if (admin.id === targetUserId) {
    return { error: "You cannot moderate your own account." };
  }

  const supabase = createAdminClient();
  const { data: target, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetUserId)
    .maybeSingle();

  if (error || !target) {
    return { error: error?.message ?? "User not found" };
  }
  if (target.role === "admin") {
    return { error: "Admin accounts cannot be suspended." };
  }

  return null;
}

export async function adminBanUser(
  userId: string,
  reason?: string
): Promise<AdminActionResult> {
  const blocked = await assertCanModerateUser(userId);
  if (blocked) return blocked;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      is_banned: true,
      ban_reason: reason?.trim() || null,
      banned_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidateUserProfile(userId);
  return { success: "User suspended" };
}

export async function adminUnbanUser(userId: string): Promise<AdminActionResult> {
  const blocked = await assertCanModerateUser(userId);
  if (blocked) return blocked;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      is_banned: false,
      ban_reason: null,
      banned_at: null,
    })
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidateUserProfile(userId);
  return { success: "User reinstated" };
}

export async function adminExtendEmployerTrial(
  userId: string,
  extraDays: number
): Promise<AdminActionResult> {
  await requireAdminProfile();
  if (!Number.isFinite(extraDays) || extraDays < 1 || extraDays > 365) {
    return { error: "Enter between 1 and 365 days." };
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "employer") {
    return { error: "User is not an employer." };
  }

  const { data: sub } = await supabase
    .from("employer_subscriptions")
    .select("trial_ends_at, stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  const base = sub?.trial_ends_at
    ? new Date(sub.trial_ends_at)
    : new Date();
  const start = base.getTime() > Date.now() ? base : new Date();
  const trialEnds = new Date(start);
  trialEnds.setDate(trialEnds.getDate() + extraDays);

  const payload = {
    user_id: userId,
    plan_id: "starter",
    status: "trialing" as const,
    trial_ends_at: trialEnds.toISOString(),
  };

  const { error } = sub
    ? await supabase
        .from("employer_subscriptions")
        .update({
          status: "trialing",
          trial_ends_at: trialEnds.toISOString(),
        })
        .eq("user_id", userId)
    : await supabase.from("employer_subscriptions").insert(payload);

  if (error) return { error: error.message };

  revalidateUserProfile(userId);
  revalidatePath("/admin/subscriptions");
  return { success: "Trial extended" };
}

export async function adminUpdateEmployerSubscription(
  userId: string,
  input: {
    planId: string;
    status: string;
    trialEndsAt?: string | null;
  }
): Promise<AdminActionResult> {
  await requireAdminProfile();

  const validPlans = ["starter", "growth", "scale"];
  const validStatuses = [
    "inactive",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
  ];

  if (!validPlans.includes(input.planId)) {
    return { error: "Invalid plan." };
  }
  if (!validStatuses.includes(input.status)) {
    return { error: "Invalid status." };
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || profile.role !== "employer") {
    return { error: "User is not an employer." };
  }

  const update = {
    plan_id: input.planId,
    status: input.status,
    trial_ends_at:
      input.status === "trialing"
        ? input.trialEndsAt ?? new Date(Date.now() + 30 * 86400000).toISOString()
        : null,
  };

  const { data: existing } = await supabase
    .from("employer_subscriptions")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  const { error } = existing
    ? await supabase
        .from("employer_subscriptions")
        .update(update)
        .eq("user_id", userId)
    : await supabase.from("employer_subscriptions").insert({
        user_id: userId,
        ...update,
      });

  if (error) return { error: error.message };

  revalidateUserProfile(userId);
  revalidatePath("/admin/subscriptions");
  return { success: "Subscription updated" };
}

export async function adminSyncExternalJobs(): Promise<AdminActionResult> {
  await requireAdminProfile();

  const { isSupabaseAdminConfigured } = await import("@/lib/supabase/admin");
  if (!isSupabaseAdminConfigured()) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." };
  }

  const { syncRssJobs } = await import("@/lib/jobs/rss-sync");
  const summary = await syncRssJobs();

  revalidateAdminPaths();

  const parts = [`${summary.totalUpserted} jobs synced`];
  if (summary.closedNonEuropean > 0) {
    parts.push(`${summary.closedNonEuropean} non-EU listings hidden`);
  }

  return { success: parts.join(" · ") };
}
