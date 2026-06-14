import type { BillingMessages } from "@/i18n/dictionaries/billing/en";
import type { SubscriptionStatus } from "@/types/billing";

export function localizedPlanName(
  planId: string,
  billing: BillingMessages
): string {
  if (planId === "growth") return billing.plans.growth.name;
  if (planId === "scale") return billing.plans.scale.name;
  if (planId === "single_post") return billing.plans.single_post.name;
  return billing.plans.starter.name;
}

export function localizedSubscriptionStatus(
  status: SubscriptionStatus,
  billing: BillingMessages
): string {
  return billing.subscriptionStatus[status] ?? status;
}
