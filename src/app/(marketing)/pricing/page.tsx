import type { Metadata } from "next";
import Link from "next/link";
import { PricingPlans } from "@/components/billing/pricing-plans";
import { StripeSetupBanner } from "@/components/billing/stripe-setup-banner";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { getCurrentProfile } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("common.pricing"),
    description: t("billing.pageSubtitle"),
  };
}

export default async function PricingPage() {
  const profile = await getCurrentProfile();
  const isEmployer = profile?.role === "employer";
  const { t } = await getServerI18n();

  return (
    <>
      <MarketingPageHero
        align="center"
        title={t("billing.pageTitle")}
        subtitle={t("billing.pageSubtitle")}
      />

      <div className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {isEmployer && (
            <div className="mb-10">
              <StripeSetupBanner />
            </div>
          )}

          <PricingPlans employerSignedIn={isEmployer} />

          <p className="mt-12 text-center text-sm text-muted-foreground">
            {t("contact.questions")}{" "}
            <Link
              href={siteConfig.links.contact}
              className="font-medium text-[#2563EB] hover:underline"
            >
              {t("billing.contactUs")}
            </Link>
            {isEmployer && (
              <>
                {" "}
                ·{" "}
                <Link
                  href={siteConfig.links.employerBilling}
                  className="font-medium text-[#2563EB] hover:underline"
                >
                  {t("billing.billingDashboard")}
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
