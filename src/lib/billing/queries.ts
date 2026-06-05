import { STARTER_PLAN, type EmployerPlanId } from "@/config/billing";
import { isStripeConfigured } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";
import type {
  EmployerBillingState,
  EmployerSubscriptionRow,
  SubscriptionStatus,
} from "@/types/billing";

function isTrialActive(row: EmployerSubscriptionRow | null): boolean {
  if (!row || row.status !== "trialing") return false;
  const endsAt = row.trial_ends_at ?? row.current_period_end;
  if (!endsAt) return true;
  return new Date(endsAt).getTime() > Date.now();
}

function mapBillingState(
  row: EmployerSubscriptionRow | null
): EmployerBillingState {
  const billingEnforced = isStripeConfigured();
  const status: SubscriptionStatus = row?.status ?? "inactive";
  const planId = (row?.plan_id ?? STARTER_PLAN.id) as EmployerPlanId | string;
  const hasPaidSubscription = status === "active";
  const trialActive = isTrialActive(row);
  const hasAccess = hasPaidSubscription || trialActive;

  return {
    planId,
    status,
    currentPeriodEnd: row?.current_period_end ?? null,
    cancelAtPeriodEnd: row?.cancel_at_period_end ?? false,
    stripeCustomerId: row?.stripe_customer_id ?? null,
    trialEndsAt: row?.trial_ends_at ?? null,
    hasPaidSubscription,
    isTrialActive: trialActive,
    billingEnforced,
    hasAccess,
  };
}

export async function getEmployerBillingState(
  employerId: string
): Promise<EmployerBillingState> {
  const supabase = await createClient();
  await supabase.rpc("ensure_employer_subscription");

  const { data } = await supabase
    .from("employer_subscriptions")
    .select("*")
    .eq("user_id", employerId)
    .maybeSingle();

  return mapBillingState((data as EmployerSubscriptionRow | null) ?? null);
}

export function planDisplayName(planId: string): string {
  if (planId === "growth") return "Growth";
  if (planId === "scale") return "Scale";
  return STARTER_PLAN.name;
}

export function statusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    inactive: "Not subscribed",
    trialing: "Free trial",
    active: "Active",
    past_due: "Past due",
    canceled: "Canceled",
    unpaid: "Unpaid",
  };
  return labels[status] ?? status;
}
