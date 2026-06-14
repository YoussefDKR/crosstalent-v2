import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { CheckoutButton } from "@/components/billing/checkout-button";
import { ManageBillingButton } from "@/components/billing/manage-billing-button";
import { PricingPlans } from "@/components/billing/pricing-plans";
import { StripeSetupBanner } from "@/components/billing/stripe-setup-banner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import {
  localizedPlanName,
  localizedSubscriptionStatus,
} from "@/lib/billing/labels";
import { getEmployerBillingState } from "@/lib/billing/queries";
import { TRIAL_DURATION_DAYS, TRIAL_PUBLISHED_JOB_LIMIT } from "@/config/billing";
import {
  isPlanCheckoutReady,
  isStripeConfigured,
} from "@/lib/stripe/config";
import { EMPLOYER_PLANS } from "@/config/billing";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.billing.title") };
}

type BillingPageProps = {
  searchParams: Promise<{
    success?: string;
    canceled?: string;
    single_post?: string;
  }>;
};

export default async function EmployerBillingPage({
  searchParams,
}: BillingPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t, locale, messages } = await getServerI18n();
  const b = messages.billing;
  const [billing, access] = await Promise.all([
    getEmployerBillingState(profile.id),
    getEmployerFeatureAccess(profile.id),
  ]);
  const params = await searchParams;
  const stripeReady = isStripeConfigured();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale);

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.billing.title")}
      description={t("employer.billing.subtitle")}
    >
      <StripeSetupBanner />

      {access.postCredits > 0 && (
        <div className="mb-6 rounded-xl border border-[#10B981]/25 bg-[#ECFDF5] px-5 py-4">
          <p className="font-semibold text-[#0F172A]">
            {t(
              access.postCredits === 1
                ? "employer.billing.postCredits"
                : "employer.billing.postCreditsPlural",
              { count: access.postCredits }
            )}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("employer.billing.postCreditsDesc")}
          </p>
        </div>
      )}

      {billing.isTrialActive && (
        <div className="mb-6 rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] px-5 py-4">
          <p className="font-semibold text-[#0F172A]">
            {t("employer.billing.trialActive", { days: TRIAL_DURATION_DAYS })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("employer.billing.trialIncludes", {
              limit: TRIAL_PUBLISHED_JOB_LIMIT,
            })}
            {access.trialDaysRemaining != null && (
              <>
                {" "}
                {t(
                  access.trialDaysRemaining === 1
                    ? "employer.billing.daysRemaining"
                    : "employer.billing.daysRemainingPlural",
                  { days: access.trialDaysRemaining }
                )}
              </>
            )}
            {access.publishedJobCount > 0 && (
              <>
                {" "}
                {t(
                  access.publishedJobCount === 1
                    ? "employer.billing.jobsLive"
                    : "employer.billing.jobsLivePlural",
                  {
                    count: access.publishedJobCount,
                    limit: access.publishedJobLimit ?? 0,
                  }
                )}
              </>
            )}
          </p>
        </div>
      )}

      {!billing.isTrialActive && !billing.hasPaidSubscription && (
        <div className="mb-6 rounded-xl border border-dashed border-border bg-white px-5 py-4">
          <p className="font-semibold text-[#0F172A]">
            {t("employer.billing.noActiveTrial")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("employer.billing.noActiveTrialDesc", {
              days: TRIAL_DURATION_DAYS,
            })}
          </p>
        </div>
      )}

      {params.success === "1" && (
        <p className="mb-6 rounded-lg bg-[#10B981]/10 px-4 py-3 text-sm text-[#047857]">
          {params.single_post === "1"
            ? t("employer.billing.singlePostReceived")
            : t("employer.billing.paymentReceived")}
        </p>
      )}
      {params.canceled === "1" && (
        <p className="mb-6 rounded-lg bg-slate-100 px-4 py-3 text-sm text-muted-foreground">
          {t("employer.billing.checkoutCanceled")}
        </p>
      )}

      <Card className="mb-10 border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <CreditCard className="size-6" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("employer.billing.currentPlan")}
              </p>
              <p className="text-xl font-semibold text-[#0F172A]">
                {localizedPlanName(billing.planId, b)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("employer.billing.statusLabel", {
                  status: localizedSubscriptionStatus(billing.status, b),
                })}
                {billing.currentPeriodEnd && billing.hasPaidSubscription && (
                  <>
                    {" "}
                    {t("employer.billing.renews", {
                      date: formatDate(billing.currentPeriodEnd),
                    })}
                  </>
                )}
                {billing.cancelAtPeriodEnd &&
                  t("employer.billing.cancelsAtPeriodEnd")}
              </p>
              {billing.trialEndsAt && billing.isTrialActive && (
                <p className="mt-2 text-xs text-[#2563EB]">
                  {t("employer.billing.trialEnds", {
                    date: formatDate(billing.trialEndsAt),
                  })}
                </p>
              )}
            </div>
          </div>
          {billing.stripeCustomerId && stripeReady && (
            <ManageBillingButton />
          )}
        </CardContent>
      </Card>

      {!billing.hasPaidSubscription && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            {t("employer.billing.upgradePlan")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {EMPLOYER_PLANS.map((plan) => {
              const planCopy = b.plans[plan.id as "growth" | "scale"];
              return (
                <Card key={plan.id} className="border-border/80">
                  <CardContent className="p-6">
                    <p className="font-semibold text-[#0F172A]">
                      {planCopy.name}
                    </p>
                    <p className="text-2xl font-semibold mt-1">
                      €{plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        {t("billing.perMonth")}
                      </span>
                    </p>
                    <div className="mt-4">
                      <CheckoutButton
                        planId={plan.id}
                        label={planCopy.cta}
                        disabled={
                          !stripeReady || !isPlanCheckoutReady(plan.id)
                        }
                        disabledReason={
                          !stripeReady
                            ? b.configureStripeEnv
                            : t("billing.missingPriceEnv", {
                                plan: plan.id.toUpperCase(),
                              })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
        {t("employer.billing.allPlans")}
      </h2>
      <PricingPlans employerSignedIn />

      <p className="mt-8 text-sm text-muted-foreground">
        {t("employer.billing.setupInstructions")}{" "}
        <Link href="/docs/stripe" className="text-[#2563EB] hover:underline">
          {t("employer.billing.stripeGuide")}
        </Link>
      </p>
    </DashboardShell>
  );
}
