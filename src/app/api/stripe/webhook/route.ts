import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { EmployerPlanId } from "@/config/billing";
import {
  upsertCustomerOnly,
  upsertSubscriptionFromStripe,
} from "@/lib/billing/sync";
import { isStripeWebhookConfigured } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeWebhookConfigured() || !isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          await upsertSubscriptionFromStripe(
            subscription,
            session.metadata?.user_id,
            session.metadata?.plan_id as EmployerPlanId | undefined
          );
        }
        if (session.customer && session.metadata?.user_id) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id;
          await upsertCustomerOnly(session.metadata.user_id, customerId);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(subscription);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
