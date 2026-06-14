import type Stripe from "stripe";
import type { EmployerPlanId } from "@/config/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionStatus } from "@/types/billing";

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
      return "canceled";
    case "unpaid":
      return "unpaid";
    default:
      return "inactive";
  }
}

export async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  fallbackUserId?: string,
  fallbackPlanId?: EmployerPlanId
) {
  const userId =
    subscription.metadata.user_id ??
    fallbackUserId ??
    subscription.metadata.userId;
  const planId =
    (subscription.metadata.plan_id as EmployerPlanId | undefined) ??
    fallbackPlanId ??
    "growth";

  if (!userId) {
    throw new Error("Subscription missing user_id metadata");
  }

  const admin = createAdminClient();
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const periodEndUnix =
    subscription.items?.data?.[0] &&
    "current_period_end" in subscription.items.data[0] &&
    typeof subscription.items.data[0].current_period_end === "number"
      ? subscription.items.data[0].current_period_end
      : (subscription as Stripe.Subscription & { current_period_end?: number })
          .current_period_end;
  const periodEnd =
    typeof periodEndUnix === "number"
      ? new Date(periodEndUnix * 1000).toISOString()
      : null;

  const { error } = await admin.from("employer_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan_id: planId,
      status: mapStripeStatus(subscription.status),
      current_period_end: periodEnd,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
}

export async function addPostCredit(userId: string, credits: number) {
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("employer_subscriptions")
    .select("post_credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("employer_subscriptions")
      .update({ post_credits: (existing.post_credits ?? 0) + credits })
      .eq("user_id", userId);
    if (error) throw error;
    return;
  }

  const { error } = await admin.from("employer_subscriptions").insert({
    user_id: userId,
    plan_id: "starter",
    status: "inactive",
    post_credits: credits,
  });
  if (error) throw error;
}

export async function upsertCustomerOnly(
  userId: string,
  stripeCustomerId: string
) {
  const admin = createAdminClient();
  const { error } = await admin.from("employer_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: stripeCustomerId,
      plan_id: "starter",
      status: "inactive",
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}
