import type { EmployerPlanId } from "@/config/billing";

export type SubscriptionStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type EmployerSubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_id: EmployerPlanId | string;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type EmployerBillingState = {
  planId: EmployerPlanId | string;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  hasPaidSubscription: boolean;
  /** All features unlocked while Stripe keys are not set (dev / pre-launch). */
  billingEnforced: boolean;
  hasAccess: boolean;
};
