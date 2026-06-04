import { EMPLOYER_PLANS } from "@/config/billing";

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(
    isStripeConfigured() && process.env.STRIPE_WEBHOOK_SECRET?.trim()
  );
}

/** True when a paid plan has a Stripe Price ID in env. */
export function isPlanCheckoutReady(planId: string): boolean {
  const plan = EMPLOYER_PLANS.find((p) => p.id === planId);
  return Boolean(plan?.stripePriceId);
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
}
