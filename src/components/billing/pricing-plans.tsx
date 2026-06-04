import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import {
  EMPLOYER_PLANS,
  STARTER_PLAN,
} from "@/config/billing";
import {
  isPlanCheckoutReady,
  isStripeConfigured,
} from "@/lib/stripe/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type PricingPlansProps = {
  /** Logged-in employer sees checkout; others see signup CTA */
  employerSignedIn?: boolean;
};

export function PricingPlans({ employerSignedIn = false }: PricingPlansProps) {
  const stripeReady = isStripeConfigured();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex h-full flex-col p-8">
          <p className="text-sm font-medium text-[#2563EB]">Free to start</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#0F172A]">
            {STARTER_PLAN.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {STARTER_PLAN.description}
          </p>
          <p className="mt-6">
            <span className="text-4xl font-semibold text-[#0F172A]">€0</span>
            <span className="text-muted-foreground"> / month</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {STARTER_PLAN.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-[#0F172A]/85">
                <Check className="size-4 shrink-0 text-[#10B981]" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {employerSignedIn ? (
              <p className="text-center text-sm text-muted-foreground">
                Your current explore tier
              </p>
            ) : (
              <Link href={siteConfig.links.employerSignup}>
                <Button variant="outline" className="w-full">
                  Sign up as employer
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {EMPLOYER_PLANS.map((plan) => {
        const checkoutReady = stripeReady && isPlanCheckoutReady(plan.id);
        const disabledReason = !stripeReady
          ? "Add Stripe keys to .env.local to enable checkout"
          : !plan.stripePriceId
            ? `Set STRIPE_PRICE_${plan.id.toUpperCase()} in .env.local`
            : undefined;

        return (
          <Card
            key={plan.id}
            className={cn(
              "border-border/80 shadow-sm",
              plan.highlighted &&
                "ring-2 ring-[#2563EB]/40 shadow-md shadow-[#2563EB]/10"
            )}
          >
            <CardContent className="flex h-full flex-col p-8">
              {plan.highlighted && (
                <p className="text-sm font-medium text-[#2563EB]">Most popular</p>
              )}
              <h3 className="mt-2 text-2xl font-semibold text-[#0F172A]">
                {plan.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <p className="mt-6">
                <span className="text-4xl font-semibold text-[#0F172A]">
                  €{plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-[#0F172A]/85">
                    <Check className="size-4 shrink-0 text-[#10B981]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {employerSignedIn ? (
                  <CheckoutButton
                    planId={plan.id}
                    label={plan.cta}
                    disabled={!checkoutReady}
                    disabledReason={disabledReason}
                  />
                ) : (
                  <Link href={siteConfig.links.employerSignup}>
                    <Button
                      className={cn(
                        "w-full",
                        plan.highlighted &&
                          "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                      )}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Get started
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
