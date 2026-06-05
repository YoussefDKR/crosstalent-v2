import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Globe2,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  UserRound,
  Workflow,
} from "lucide-react";
import { BetaBanner } from "@/components/landing/beta-banner";
import { Button } from "@/components/ui/button";
import {
  whyDifferentiators,
  whyFaqs,
  whyPillars,
  whyProblems,
} from "@/config/why-crosstalent";
import { howItWorksSteps, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const problemIcons = {
  globe: Globe2,
  search: Search,
  shield: Shield,
} as const;

const pillarIcons = {
  bridge: Globe2,
  quality: Sparkles,
  flow: Workflow,
} as const;

const stepIcons = {
  user: UserRound,
  search: Search,
  message: MessageSquare,
} as const;

export function WhyCrossTalentPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#F8FAFC] py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#2563EB12,_transparent_55%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2563EB]">
            Why CrossTalent
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Cross-border hiring should feel{" "}
            <span className="text-[#2563EB]">obvious</span>, not impossible.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We exist to connect ambitious professionals in North Africa with
            European companies that need their skills — remotely, transparently,
            and with respect on both sides of the Mediterranean.
          </p>
        </div>
      </section>

      <BetaBanner />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              The gap we&apos;re closing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Millions of people are ready to work with Europe. Too often, the
              infrastructure still isn&apos;t.
            </p>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {whyProblems.map((item) => {
              const Icon = problemIcons[item.icon];
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-[#0F172A] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What we do differently
            </h2>
            <p className="mt-4 text-lg text-slate-300">
              CrossTalent is a dedicated bridge — not a generic board with a
              world map slapped on the homepage.
            </p>
          </div>
          <ul className="mt-14 grid gap-8 lg:grid-cols-3">
            {whyPillars.map((item) => {
              const Icon = pillarIcons[item.icon];
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-[#2563EB] text-white">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              CrossTalent vs. the usual job hunt
            </h2>
            <p className="mt-4 text-muted-foreground">
              A side-by-side look at what you can expect here.
            </p>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
            <div className="grid grid-cols-3 border-b border-border/80 bg-slate-50 text-sm font-semibold text-[#0F172A]">
              <div className="p-4 sm:p-5" />
              <div className="border-l border-border/80 p-4 text-muted-foreground sm:p-5">
                Typical boards
              </div>
              <div className="border-l border-border/80 bg-[#2563EB]/5 p-4 text-[#2563EB] sm:p-5">
                CrossTalent
              </div>
            </div>
            {whyDifferentiators.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-3 text-sm sm:text-base",
                  i < whyDifferentiators.length - 1 &&
                    "border-b border-border/60"
                )}
              >
                <div className="p-4 font-medium text-[#0F172A] sm:p-5">
                  {row.label}
                </div>
                <div className="border-l border-border/60 p-4 text-muted-foreground sm:p-5">
                  {row.generic}
                </div>
                <div className="border-l border-border/60 bg-[#2563EB]/[0.03] p-4 font-medium text-[#0F172A] sm:p-5">
                  {row.crossTalent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-slate-50/80 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step) => {
              const Icon = stepIcons[step.icon];
              return (
                <li
                  key={step.step}
                  className="relative rounded-2xl border border-border/80 bg-white p-8 text-center shadow-sm"
                >
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB]">
                    <Icon className="size-7" strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-widest text-[#2563EB]">
                    STEP {step.step}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A]">
            Common questions
          </h2>
          <dl className="mt-12 space-y-6">
            {whyFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm"
              >
                <dt className="text-lg font-semibold text-[#0F172A]">
                  {faq.question}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm lg:p-10">
              <Layers className="size-8 text-[#2563EB]" />
              <h3 className="mt-6 text-2xl font-semibold text-[#0F172A]">
                Ready to find your next role?
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Create a free profile, browse remote and hybrid jobs, and apply
                to verified European employers.
              </p>
              <Link href={siteConfig.links.forCandidates} className="mt-8 inline-block">
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-[#2563EB] px-8 text-base font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  For job seekers
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-[#0F172A]/10 bg-[#0F172A] p-8 text-white lg:p-10">
              <Briefcase className="size-8 text-[#2563EB]" />
              <h3 className="mt-6 text-2xl font-semibold">Hiring across borders?</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                Post roles, search talent by skills and languages, and manage
                applications in one place.
              </p>
              <Link
                href={siteConfig.links.forEmployers}
                className="mt-8 inline-block"
              >
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-white px-8 text-base font-semibold text-[#0F172A] hover:bg-slate-100"
                >
                  Start hiring
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link
                href={siteConfig.links.pricing}
                className="mt-4 block text-sm font-medium text-[#2563EB] hover:underline"
              >
                View employer pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
