import type { Metadata } from "next";
import Link from "next/link";
import { PricingPlans } from "@/components/billing/pricing-plans";
import { StripeSetupBanner } from "@/components/billing/stripe-setup-banner";
import { getCurrentProfile } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Employer plans for hiring cross-border talent on CrossTalent",
};

export default async function PricingPage() {
  const profile = await getCurrentProfile();
  const isEmployer = profile?.role === "employer";

  return (
    <div className="bg-slate-50/50 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Employer pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Candidates always join free. Employers choose a plan when ready to
            scale hiring across MENA and Europe.
          </p>
        </div>

        {isEmployer && (
          <div className="mt-10">
            <StripeSetupBanner />
          </div>
        )}

        <div className={isEmployer ? "" : "mt-14"}>
          <PricingPlans employerSignedIn={isEmployer} />
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Questions?{" "}
          <Link href={siteConfig.links.contact} className="font-medium text-[#2563EB] hover:underline">
            Contact us
          </Link>
          {isEmployer && (
            <>
              {" "}
              ·{" "}
              <Link
                href={siteConfig.links.employerBilling}
                className="font-medium text-[#2563EB] hover:underline"
              >
                Billing dashboard
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
