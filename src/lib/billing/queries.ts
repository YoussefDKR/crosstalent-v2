import {
  ACTIVE_SUBSCRIPTION_STATUSES,
  STARTER_PLAN,
  type EmployerPlanId,
} from "@/config/billing";
import { isStripeConfigured } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";
import type {
  EmployerBillingState,
  EmployerSubscriptionRow,
  SubscriptionStatus,
} from "@/types/billing";

function mapBillingState(
  row: EmployerSubscriptionRow | null
): EmployerBillingState {
  const billingEnforced = isStripeConfigured();
  const status: SubscriptionStatus = row?.status ?? "inactive";
  const planId = (row?.plan_id ?? STARTER_PLAN.id) as EmployerPlanId | string;
  const hasPaidSubscription = ACTIVE_SUBSCRIPTION_STATUSES.includes(
    status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number]
  );

  const hasAccess =
    !billingEnforced ||
    hasPaidSubscription ||
    planId === STARTER_PLAN.id;

  return {
    planId,
    status,
    currentPeriodEnd: row?.current_period_end ?? null,
    cancelAtPeriodEnd: row?.cancel_at_period_end ?? false,
    stripeCustomerId: row?.stripe_customer_id ?? null,
    hasPaidSubscription,
    billingEnforced,
    hasAccess,
  };
}

export async function getEmployerBillingState(
  employerId: string
): Promise<EmployerBillingState> {
  const supabase = await createClient();
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
    trialing: "Trial",
    active: "Active",
    past_due: "Past due",
    canceled: "Canceled",
    unpaid: "Unpaid",
  };
  return labels[status] ?? status;
}
