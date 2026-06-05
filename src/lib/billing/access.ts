import {
  PUBLISHED_JOB_LIMITS,
  STARTER_PLAN,
  TRIAL_PUBLISHED_JOB_LIMIT,
  type EmployerPlanId,
} from "@/config/billing";
import { createClient } from "@/lib/supabase/server";
import type {
  EmployerFeatureAccess,
  EmployerSubscriptionRow,
  SubscriptionStatus,
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
): number | null {
  if (paidActive) {
    const planId = (row?.plan_id ?? STARTER_PLAN.id) as EmployerPlanId;
    return PUBLISHED_JOB_LIMITS[planId] ?? 0;
  }
  if (trialActive) return TRIAL_PUBLISHED_JOB_LIMIT;
  return 0;
}

export async function countPublishedEmployerJobs(
  employerId: string
): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("employer_id", employerId)
    .eq("source_type", "platform")
    .eq("status", "published");

  return count ?? 0;
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
  const canViewCandidates = paidActive || trialActive;
  const publishedJobLimit = publishedLimitFor(row, paidActive, trialActive);
  const publishedJobCount = await countPublishedEmployerJobs(employerId);

  const canPublishJobs =
    publishedJobLimit === null || publishedJobCount < publishedJobLimit;

  return {
    canViewCandidates,
    canPublishJobs,
    publishedJobCount,
    publishedJobLimit,
    isTrialActive: trialActive,
    trialEndsAt: row?.trial_ends_at ?? null,
    trialDaysRemaining: trialActive
      ? trialDaysRemaining(row?.trial_ends_at ?? row?.current_period_end ?? null)
      : null,
    hasPaidSubscription: paidActive,
    needsUpgrade: !canViewCandidates,
  };
}

export function publishBlockedMessage(access: EmployerFeatureAccess): string {
  if (access.isTrialActive && !access.canPublishJobs) {
    return `Your trial includes ${TRIAL_PUBLISHED_JOB_LIMIT} published job. Upgrade to post more roles.`;
  }
  if (!access.hasPaidSubscription && !access.isTrialActive) {
    return "Start your free 30-day trial or subscribe to publish jobs on the board.";
  }
  if (!access.canPublishJobs) {
    return "You've reached your plan's job post limit. Upgrade to publish more.";
  }
  return "Unable to publish this job.";
}
