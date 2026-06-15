"use client";

import Link from "next/link";
import { PricingPlans } from "@/components/billing/pricing-plans";
import { StripeSetupBanner } from "@/components/billing/stripe-setup-banner";
import { MarketingReveal } from "@/components/marketing/marketing-reveal";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/context/i18n-provider";

type PricingPageContentProps = {
  isEmployer: boolean;
};

export function PricingPageContent({ isEmployer }: PricingPageContentProps) {
  const { t } = useI18n();

  return (
    <div className="bg-white py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {isEmployer && (
          <MarketingReveal className="mb-10">
            <StripeSetupBanner />
          </MarketingReveal>
        )}

        <MarketingReveal delay={isEmployer ? 0.08 : 0}>
          <PricingPlans employerSignedIn={isEmployer} />
        </MarketingReveal>

        <MarketingReveal
          className="mt-12 text-center text-sm text-muted-foreground"
          delay={0.15}
        >
          {t("contact.questions")}{" "}
          <Link href={siteConfig.links.contact} className="link-brand">
            {t("billing.contactUs")}
          </Link>
          {isEmployer && (
            <>
              {" "}
              ·{" "}
              <Link
                href={siteConfig.links.employerBilling}
                className="link-brand"
              >
                {t("billing.billingDashboard")}
              </Link>
            </>
          )}
        </MarketingReveal>
      </div>
    </div>
  );
}
