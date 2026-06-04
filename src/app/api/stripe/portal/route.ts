import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerBillingState } from "@/lib/billing/queries";
import { getSiteUrl, isStripeConfigured } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. See docs/STRIPE.md." },
      { status: 503 }
    );
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const billing = await getEmployerBillingState(profile.id);
  if (!billing.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet. Subscribe to a plan first." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: `${getSiteUrl()}/employer/billing`,
  });

  return NextResponse.json({ url: session.url });
}
