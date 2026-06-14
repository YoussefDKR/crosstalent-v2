"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
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

const cardShadow = {
  default: "0 4px 14px rgba(15, 23, 42, 0.08)",
  highlighted: "0 12px 32px rgba(37, 99, 235, 0.18)",
  hover: "0 28px 56px -14px rgba(37, 99, 235, 0.42)",
} as const;

function PricingPlanCard({
  highlighted,
  children,
}: {
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="group h-full cursor-pointer rounded-xl"
      initial={{
        y: 0,
        scale: 1,
        boxShadow: highlighted ? cardShadow.highlighted : cardShadow.default,
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
        boxShadow: cardShadow.hover,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <Card
        className={cn(
          "h-full overflow-visible py-0 ring-1 ring-foreground/10 transition-colors duration-300",
          "group-hover:ring-2 group-hover:ring-[#2563EB] group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-[#DBEAFE]",
          highlighted && "ring-2 ring-[#2563EB]/55"
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}

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
      <PricingPlanCard>
        <CardContent className="flex h-full flex-col p-8">
          <p className="text-sm font-medium text-[#2563EB]">{b.freeToStart}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#0F172A] transition-colors duration-300 group-hover:text-[#2563EB]">
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
      </PricingPlanCard>

      {EMPLOYER_PLANS.map((plan) => {
        const planCopy = planMessages[plan.id as keyof typeof planMessages];
        const checkoutReady = stripeReady && isPlanCheckoutReady(plan.id);
        const disabledReason = !stripeReady ? b.stripeNotReady : undefined;

        return (
          <PricingPlanCard key={plan.id} highlighted={plan.highlighted}>
            <CardContent className="flex h-full flex-col p-8">
              {plan.highlighted && (
                <p className="text-sm font-medium text-[#2563EB]">{b.mostPopular}</p>
              )}
              <h3 className="mt-2 text-2xl font-semibold text-[#0F172A] transition-colors duration-300 group-hover:text-[#2563EB]">
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
          </PricingPlanCard>
        );
      })}
    </div>
  );
}
