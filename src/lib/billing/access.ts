import {
  POST_DURATION_DAYS,
  PUBLISHED_JOB_LIMITS,
  STARTER_PLAN,
  TRIAL_DURATION_DAYS,
  TRIAL_PUBLISHED_JOB_LIMIT,
  postDurationDaysForPlan,
  type EmployerPlanId,
} from "@/config/billing";
import { createClient } from "@/lib/supabase/server";
import type {
  EmployerFeatureAccess,
  EmployerSubscriptionRow,
} from "@/types/billing";

function isTrialActive(row: EmployerSubscriptionRow | null): boolean {
  if (!row || row.status !== "trialing") return false;
  const endsAt = row.trial_ends_at ?? row.current_period_end;
  if (!endsAt) return true;
  return new Date(endsAt).getTime() > Date.now();
}

function trialDaysRemaining(endsAt: string | null): number | null {
  if (!endsAt) return null;
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function publishedLimitFor(
  row: EmployerSubscriptionRow | null,
  paidActive: boolean,
  trialActive: boolean
): number {
  if (paidActive) {
    const planId = (row?.plan_id ?? STARTER_PLAN.id) as EmployerPlanId;
    return PUBLISHED_JOB_LIMITS[planId] ?? 0;
  }
  if (trialActive) return TRIAL_PUBLISHED_JOB_LIMIT;
  return 0;
}

const nowIso = () => new Date().toISOString();

export async function closeExpiredEmployerJobs(
  employerId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("jobs")
    .update({ status: "closed" })
    .eq("employer_id", employerId)
    .eq("source_type", "platform")
    .eq("status", "published")
    .not("expires_at", "is", null)
    .lt("expires_at", nowIso());
}

export async function countPublishedEmployerJobs(
  employerId: string
): Promise<number> {
  await closeExpiredEmployerJobs(employerId);

  const supabase = await createClient();
  const { count } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerId)
    .eq("source_type", "platform")
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${nowIso()}`);

  return count ?? 0;
}

export type PublishEntitlement = {
  durationDays: number;
  usesPostCredit: boolean;
};

export async function resolvePublishEntitlement(
  employerId: string,
  row?: EmployerSubscriptionRow | null
): Promise<PublishEntitlement | null> {
  const supabase = await createClient();

  if (!row) {
    await supabase.rpc("ensure_employer_subscription");
    const { data } = await supabase
      .from("employer_subscriptions")
      .select("*")
      .eq("user_id", employerId)
      .maybeSingle();
    row = (data as EmployerSubscriptionRow | null) ?? null;
  }

  const paidActive = row?.status === "active";
  const trialActive = isTrialActive(row);

  if (paidActive) {
    return {
      durationDays: postDurationDaysForPlan(row?.plan_id ?? "growth"),
      usesPostCredit: false,
    };
  }
  if (trialActive) {
    return {
      durationDays: TRIAL_DURATION_DAYS,
      usesPostCredit: false,
    };
  }
  if ((row?.post_credits ?? 0) > 0) {
    return {
      durationDays: POST_DURATION_DAYS.single_post,
      usesPostCredit: true,
    };
  }
  return null;
}

export async function consumePostCredit(employerId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employer_subscriptions")
    .select("post_credits")
    .eq("user_id", employerId)
    .maybeSingle();

  const credits = data?.post_credits ?? 0;
  if (credits < 1) return false;

  const { error } = await supabase
    .from("employer_subscriptions")
    .update({ post_credits: credits - 1 })
    .eq("user_id", employerId)
    .eq("post_credits", credits);

  return !error;
}

export function computeJobExpiresAt(durationDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + durationDays);
  return d.toISOString();
}

export async function getEmployerFeatureAccess(
  employerId: string,
  row?: EmployerSubscriptionRow | null
): Promise<EmployerFeatureAccess> {
  const supabase = await createClient();

  if (!row) {
    await supabase.rpc("ensure_employer_subscription");
    const { data } = await supabase
      .from("employer_subscriptions")
      .select("*")
      .eq("user_id", employerId)
      .maybeSingle();
    row = (data as EmployerSubscriptionRow | null) ?? null;
  }

  const paidActive = row?.status === "active";
  const trialActive = isTrialActive(row);
  const postCredits = row?.post_credits ?? 0;
  const canViewCandidates = paidActive || trialActive;
  const publishedJobLimit = publishedLimitFor(row, paidActive, trialActive);
  const publishedJobCount = await countPublishedEmployerJobs(employerId);

  const canPublishViaPlan =
    (paidActive || trialActive) && publishedJobCount < publishedJobLimit;
  const canPublishViaCredit = !paidActive && !trialActive && postCredits > 0;
  const canPublishJobs = canPublishViaPlan || canPublishViaCredit;

  return {
    canViewCandidates,
    canPublishJobs,
    publishedJobCount,
    publishedJobLimit: paidActive || trialActive ? publishedJobLimit : null,
    postCredits,
    isTrialActive: trialActive,
    trialEndsAt: row?.trial_ends_at ?? null,
    trialDaysRemaining: trialActive
      ? trialDaysRemaining(row?.trial_ends_at ?? row?.current_period_end ?? null)
      : null,
    hasPaidSubscription: paidActive,
    needsUpgrade: !canViewCandidates && postCredits === 0,
  };
}

export function publishBlockedMessage(access: EmployerFeatureAccess): string {
  if (access.postCredits > 0 && !access.hasPaidSubscription && !access.isTrialActive) {
    return "You have post credits — publish a job to use one (live for 30 days).";
  }
  if (access.isTrialActive && !access.canPublishJobs) {
    return `Your free access includes ${TRIAL_PUBLISHED_JOB_LIMIT} live job for ${TRIAL_DURATION_DAYS} days. Upgrade to post more roles.`;
  }
  if (!access.hasPaidSubscription && !access.isTrialActive && access.postCredits === 0) {
    return `Start your free ${TRIAL_DURATION_DAYS}-day access, buy a €79 single post, or subscribe to publish on the board.`;
  }
  if (!access.canPublishJobs) {
    return "You've reached your plan's live job limit. Upgrade to publish more.";
  }
  return "Unable to publish this job.";
}
