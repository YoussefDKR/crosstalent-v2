import type { Metadata } from "next";
import { PricingPageContent } from "@/components/billing/pricing-page-content";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { getCurrentProfile } from "@/lib/auth/session";
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

      <PricingPageContent isEmployer={isEmployer} />
    </>
  );
}
