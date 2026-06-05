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
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import {
  getEmployerBillingState,
  planDisplayName,
  statusLabel,
} from "@/lib/billing/queries";
import { TRIAL_DURATION_DAYS, TRIAL_PUBLISHED_JOB_LIMIT } from "@/config/billing";
import {
  isPlanCheckoutReady,
  isStripeConfigured,
} from "@/lib/stripe/config";
import { EMPLOYER_PLANS } from "@/config/billing";

export const metadata: Metadata = {
  title: "Billing",
};

type BillingPageProps = {
  searchParams: Promise<{ success?: string; canceled?: string }>;
};

export default async function EmployerBillingPage({
  searchParams,
}: BillingPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const [billing, access] = await Promise.all([
    getEmployerBillingState(profile.id),
    getEmployerFeatureAccess(profile.id),
  ]);
  const params = await searchParams;
  const stripeReady = isStripeConfigured();

  return (
    <DashboardShell
      profile={profile}
      title="Billing"
      description="Manage your CrossTalent employer subscription."
    >
      <StripeSetupBanner />

      {billing.isTrialActive && (
        <div className="mb-6 rounded-xl border border-[#2563EB]/20 bg-[#EFF6FF] px-5 py-4">
          <p className="font-semibold text-[#0F172A]">
            Free {TRIAL_DURATION_DAYS}-day trial active
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Includes candidate search and {TRIAL_PUBLISHED_JOB_LIMIT} published
            job on the board
            {access.trialDaysRemaining != null && (
              <>
                {" "}
                · {access.trialDaysRemaining} day
                {access.trialDaysRemaining === 1 ? "" : "s"} remaining
              </>
            )}
            {access.publishedJobCount > 0 && (
              <>
                {" "}
                · {access.publishedJobCount}/{access.publishedJobLimit}{" "}
                job live
              </>
            )}
          </p>
        </div>
      )}

      {!billing.isTrialActive && !billing.hasPaidSubscription && (
        <div className="mb-6 rounded-xl border border-dashed border-border bg-white px-5 py-4">
          <p className="font-semibold text-[#0F172A]">No active trial</p>
          <p className="mt-1 text-sm text-muted-foreground">
            New employers receive a {TRIAL_DURATION_DAYS}-day trial automatically.
            Subscribe to Growth or Scale for ongoing candidate access and more job
            posts.
          </p>
        </div>
      )}

      {params.success === "1" && (
        <p className="mb-6 rounded-lg bg-[#10B981]/10 px-4 py-3 text-sm text-[#047857]">
          Payment received — your plan will update shortly. Refresh if status
          does not change in a minute.
        </p>
      )}
      {params.canceled === "1" && (
        <p className="mb-6 rounded-lg bg-slate-100 px-4 py-3 text-sm text-muted-foreground">
          Checkout canceled. You can subscribe anytime below.
        </p>
      )}

      <Card className="mb-10 border-border/80 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <CreditCard className="size-6" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Current plan</p>
              <p className="text-xl font-semibold text-[#0F172A]">
                {planDisplayName(billing.planId)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Status: {statusLabel(billing.status)}
                {billing.currentPeriodEnd && billing.hasPaidSubscription && (
                  <>
                    {" "}
                    · Renews{" "}
                    {new Date(billing.currentPeriodEnd).toLocaleDateString()}
                  </>
                )}
                {billing.cancelAtPeriodEnd && " · Cancels at period end"}
              </p>
              {billing.trialEndsAt && billing.isTrialActive && (
                <p className="mt-2 text-xs text-[#2563EB]">
                  Trial ends{" "}
                  {new Date(billing.trialEndsAt).toLocaleDateString()}
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
            Upgrade your plan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {EMPLOYER_PLANS.map((plan) => (
              <Card key={plan.id} className="border-border/80">
                <CardContent className="p-6">
                  <p className="font-semibold text-[#0F172A]">{plan.name}</p>
                  <p className="text-2xl font-semibold mt-1">
                    €{plan.monthlyPrice}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <div className="mt-4">
                    <CheckoutButton
                      planId={plan.id}
                      label={plan.cta}
                      disabled={
                        !stripeReady || !isPlanCheckoutReady(plan.id)
                      }
                      disabledReason={
                        !stripeReady
                          ? "Configure Stripe in .env.local"
                          : `Set STRIPE_PRICE_${plan.id.toUpperCase()}`
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
        All plans
      </h2>
      <PricingPlans employerSignedIn />

      <p className="mt-8 text-sm text-muted-foreground">
        Setup instructions:{" "}
        <Link href="/docs/stripe" className="text-[#2563EB] hover:underline">
          Stripe guide
        </Link>
      </p>
    </DashboardShell>
  );
}
