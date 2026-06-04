import Link from "next/link";
import {
  Briefcase,
  Building2,
  ClipboardList,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import { PricingPlans } from "@/components/billing/pricing-plans";
import { StripeSetupBanner } from "@/components/billing/stripe-setup-banner";
import { MarketingCtaBand } from "@/components/landing/marketing-cta-band";
import { Stats } from "@/components/landing/stats";
import { Button } from "@/components/ui/button";
import {
  employerBenefits,
  employerFaqs,
  employerSteps,
} from "@/config/for-employers";
import { siteConfig } from "@/config/site";

const benefitIcons = {
  search: Search,
  briefcase: Briefcase,
  clipboard: ClipboardList,
  message: MessageSquare,
} as const;

type ForEmployersPageProps = {
  employerSignedIn?: boolean;
};

export function ForEmployersPage({
  employerSignedIn = false,
}: ForEmployersPageProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#F8FAFC] py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_#2563EB15,_transparent_50%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
                For employers
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:leading-[1.1]">
                Hire North African talent.{" "}
                <span className="text-[#2563EB]">Without the noise.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Post roles, search skilled professionals, manage applications,
                and message candidates — built for European teams hiring across
                borders.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={siteConfig.links.employerSignup}>
                  <Button
                    size="lg"
                    className="h-12 min-w-[200px] bg-[#2563EB] text-base font-semibold text-white hover:bg-[#1d4ed8]"
                  >
                    Create employer account
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 min-w-[200px] border-2 border-[#2563EB] text-base font-semibold text-[#2563EB] hover:bg-[#2563EB]/5"
                  >
                    See pricing
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free Starter plan · Upgrade when you are ready to scale hiring
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-white p-8 shadow-lg ring-1 ring-black/5">
              <div className="flex items-center gap-4 border-b border-border/60 pb-6">
                <span className="flex size-14 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <Building2 className="size-7" />
                </span>
                <div>
                  <p className="font-semibold text-[#0F172A]">Your hiring hub</p>
                  <p className="text-sm text-muted-foreground">
                    Jobs · Applications · Messages
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: Briefcase, text: "Publish remote & hybrid roles" },
                  { icon: Users, text: "Search candidates by skill & language" },
                  { icon: ClipboardList, text: "Review applications in one inbox" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm">
                    <item.icon className="size-5 shrink-0 text-[#10B981]" />
                    <span className="text-[#0F172A]">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              Everything you need to hire across borders
            </h2>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {employerBenefits.map((item) => {
              const Icon = benefitIcons[item.icon];
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        id="browse-talent"
        className="border-y border-border/80 bg-slate-50/80 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
                How hiring works on CrossTalent
              </h2>
              <p className="mt-3 text-muted-foreground">
                From company profile to published role in three steps.
              </p>
            </div>
            <Link href={siteConfig.links.employerSignup}>
              <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                Get started free
              </Button>
            </Link>
          </div>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {employerSteps.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm"
              >
                <span className="text-xs font-bold tracking-widest text-[#2563EB]">
                  STEP {step.step}
                </span>
                <h3 className="mt-3 text-xl font-semibold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Candidates always join free. Choose a plan when you are ready to
              post jobs and scale hiring.
            </p>
          </div>
          {employerSignedIn && (
            <div className="mt-8">
              <StripeSetupBanner />
            </div>
          )}
          <div className="mt-12">
            <PricingPlans employerSignedIn={employerSignedIn} />
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need a custom plan?{" "}
            <Link href="/contact" className="font-medium text-[#2563EB] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-[#0F172A]">
            Employer FAQ
          </h2>
          <dl className="mt-12 space-y-6">
            {employerFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm"
              >
                <dt className="font-semibold text-[#0F172A]">{faq.question}</dt>
                <dd className="mt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <MarketingCtaBand
        title="Start hiring on CrossTalent today"
        description="Create your employer account in minutes. Set up your company, explore talent, and post your first role when you are ready."
        primaryHref={siteConfig.links.employerSignup}
        primaryLabel="Create employer account"
        secondaryHref={siteConfig.links.pricing}
        secondaryLabel="Compare plans"
      />
    </>
  );
}
