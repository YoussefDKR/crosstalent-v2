import { NextResponse } from "next/server";
import {
  CHECKOUT_PLANS,
  type EmployerPlanId,
} from "@/config/billing";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getSiteUrl,
  isPlanCheckoutReady,
  isSinglePostPlan,
  isStripeConfigured,
} from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";
import { getEmployerBillingState } from "@/lib/billing/queries";
import { upsertCustomerOnly } from "@/lib/billing/sync";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local — see docs/STRIPE.md.",
      },
      { status: 503 }
    );
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planId = body.planId as EmployerPlanId | undefined;
  const plan = CHECKOUT_PLANS.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  if (!isPlanCheckoutReady(plan.id)) {
    return NextResponse.json(
      {
        error: `Stripe Price ID for "${plan.name}" is not set. Add STRIPE_PRICE_${plan.id.toUpperCase()} to .env.local after creating the product in Stripe.`,
      },
      { status: 503 }
    );
  }

  const billing = await getEmployerBillingState(profile.id);
  const stripe = getStripe();
  const siteUrl = getSiteUrl();
  const isOneTime = isSinglePostPlan(plan.id);

  let customerId = billing.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email ?? undefined,
      name: profile.fullName ?? undefined,
      metadata: { user_id: profile.id },
    });
    customerId = customer.id;
    await upsertCustomerOnly(profile.id, customerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isOneTime ? "payment" : "subscription",
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${siteUrl}/employer/billing?success=1${isOneTime ? "&single_post=1" : ""}`,
    cancel_url: `${siteUrl}/employer/billing?canceled=1`,
    metadata: {
      user_id: profile.id,
      plan_id: plan.id,
    },
    ...(isOneTime
      ? {}
      : {
          subscription_data: {
            metadata: {
              user_id: profile.id,
              plan_id: plan.id,
            },
          },
        }),
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
