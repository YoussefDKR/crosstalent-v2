"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { EMPLOYER_PLANS } from "@/config/billing";
import { isPlanCheckoutReady, isStripeConfigured } from "@/lib/stripe/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type PricingPlansProps = {
  employerSignedIn?: boolean;
};

export function PricingPlans({ employerSignedIn = false }: PricingPlansProps) {
  const { messages, t } = useI18n();
  const b = messages.billing;
  const stripeReady = isStripeConfigured();

  const planMessages = {
    starter: b.plans.starter,
    growth: b.plans.growth,
    scale: b.plans.scale,
  } as const;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Card className="border-border/80 shadow-sm">
        <CardContent className="flex h-full flex-col p-8">
          <p className="text-sm font-medium text-[#2563EB]">{b.freeToStart}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#0F172A]">
            {b.plans.starter.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {b.plans.starter.description}
          </p>
          <p className="mt-6">
            <span className="text-4xl font-semibold text-[#0F172A]">€0</span>
            <span className="text-muted-foreground">{b.perMonth}</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3">
            {b.plans.starter.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-[#0F172A]/85">
                <Check className="size-4 shrink-0 text-[#10B981]" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {employerSignedIn ? (
              <p className="text-center text-sm text-muted-foreground">
                {b.currentTier}
              </p>
            ) : (
              <Link href={siteConfig.links.employerSignup}>
                <Button variant="outline" className="w-full">
                  {b.signupEmployer}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {EMPLOYER_PLANS.map((plan) => {
        const planCopy = planMessages[plan.id as keyof typeof planMessages];
        const checkoutReady = stripeReady && isPlanCheckoutReady(plan.id);
        const disabledReason = !stripeReady ? b.stripeNotReady : undefined;

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
                <p className="text-sm font-medium text-[#2563EB]">{b.mostPopular}</p>
              )}
              <h3 className="mt-2 text-2xl font-semibold text-[#0F172A]">
                {planCopy.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {planCopy.description}
              </p>
              <p className="mt-6">
                <span className="text-4xl font-semibold text-[#0F172A]">
                  €{plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">{b.perMonth}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {planCopy.features.map((f) => (
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
                    label={"cta" in planCopy ? planCopy.cta : t("common.signup")}
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
                      {t("landing.getStartedFree")}
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
