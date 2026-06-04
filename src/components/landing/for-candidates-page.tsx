import Link from "next/link";
import {
  BadgeCheck,
  Briefcase,
  FileText,
  Globe2,
  Languages,
  Sparkles,
} from "lucide-react";
import { MarketingCtaBand } from "@/components/landing/marketing-cta-band";
import { Stats } from "@/components/landing/stats";
import { Button } from "@/components/ui/button";
import {
  candidateBenefits,
  candidateFaqs,
  candidateSteps,
} from "@/config/for-candidates";
import { siteConfig } from "@/config/site";

const benefitIcons = {
  free: Sparkles,
  globe: Globe2,
  profile: FileText,
  apply: Briefcase,
} as const;

export function ForCandidatesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#F8FAFC] py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_#10B98112,_transparent_50%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#10B981]">
                For job seekers
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:leading-[1.1]">
                Your skills deserve a{" "}
                <span className="text-[#2563EB]">global stage</span>.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Build a free profile, discover remote and hybrid roles with
                European companies, and apply without sending your CV into the
                void.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={siteConfig.links.candidateSignup}>
                  <Button
                    size="lg"
                    className="h-12 min-w-[200px] bg-[#2563EB] text-base font-semibold text-white hover:bg-[#1d4ed8]"
                  >
                    Create free account
                  </Button>
                </Link>
                <Link href={siteConfig.links.jobs}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 min-w-[200px] border-2 border-[#2563EB] text-base font-semibold text-[#2563EB] hover:bg-[#2563EB]/5"
                  >
                    Browse jobs
                  </Button>
                </Link>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-[#10B981]" />
                100% free for candidates — always
              </p>
            </div>
            <div className="rounded-2xl border border-border/80 bg-white p-8 shadow-lg ring-1 ring-black/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your profile includes
              </p>
              <ul className="mt-6 space-y-5">
                {[
                  { icon: FileText, label: "CV & work experience" },
                  { icon: Languages, label: "Languages & proficiency" },
                  { icon: Sparkles, label: "Skills & professional headline" },
                  { icon: Globe2, label: "Location & availability" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                      <item.icon className="size-5" />
                    </span>
                    <span className="font-medium text-[#0F172A]">{item.label}</span>
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
              Why candidates choose CrossTalent
            </h2>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {candidateBenefits.map((item) => {
              const Icon = benefitIcons[item.icon];
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
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

      <section className="border-y border-border/80 bg-[#0F172A] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            Three steps to your next role
          </h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {candidateSteps.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <span className="text-xs font-bold tracking-widest text-[#2563EB]">
                  STEP {step.step}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href={siteConfig.links.candidateSignup}>
              <Button
                size="lg"
                className="h-12 bg-[#2563EB] px-10 text-base font-semibold hover:bg-[#1d4ed8]"
              >
                Create your profile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-[#0F172A]">
            Candidate FAQ
          </h2>
          <dl className="mt-12 space-y-6">
            {candidateFaqs.map((faq) => (
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
        variant="light"
        title="Ready to build your future?"
        description="Join CrossTalent for free. Complete your profile, explore European opportunities, and apply in minutes."
        primaryHref={siteConfig.links.candidateSignup}
        primaryLabel="Create free account"
        secondaryHref={siteConfig.links.jobs}
        secondaryLabel="Browse open jobs"
      />
    </>
  );
}
