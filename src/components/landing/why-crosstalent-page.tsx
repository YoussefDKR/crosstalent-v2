"use client";

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
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import {
  MarketingReveal,
  MarketingRevealItem,
  MarketingRevealSection,
} from "@/components/marketing/marketing-reveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const problemIcons = [Globe2, Search, Shield] as const;
const pillarIcons = [Globe2, Sparkles, Workflow] as const;
const stepIcons = [UserRound, Search, MessageSquare] as const;

export function WhyCrossTalentPage() {
  const { messages } = useI18n();
  const m = messages.marketing.why;
  const landing = messages.landing;

  const howItWorksSteps = [
    {
      step: 1,
      title: landing.step1Title,
      description: landing.step1Description,
    },
    {
      step: 2,
      title: landing.step2Title,
      description: landing.step2Description,
    },
    {
      step: 3,
      title: landing.step3Title,
      description: landing.step3Description,
    },
  ];

  return (
    <>
      <MarketingPageHero
        align="center"
        eyebrow={m.eyebrow}
        title={
          <>
            {m.title}{" "}
            <span className="text-[#60A5FA]">{m.titleHighlight}</span>
            {m.titleEnd}
          </>
        }
        subtitle={m.subtitle}
      />

      <BetaBanner />

      <MarketingRevealSection className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MarketingReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              {m.gapTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{m.gapSubtitle}</p>
          </MarketingReveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {m.problems.map((item, index) => {
              const Icon = problemIcons[index];
              return (
                <MarketingRevealItem
                  key={item.title}
                  index={index}
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
                </MarketingRevealItem>
              );
            })}
          </ul>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="bg-[#0F172A] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MarketingReveal className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {m.pillarsDarkTitle}
            </h2>
            <p className="mt-4 text-lg text-slate-300">{m.pillarsSubtitle}</p>
          </MarketingReveal>
          <ul className="mt-14 grid gap-8 lg:grid-cols-3">
            {m.pillars.map((item, index) => {
              const Icon = pillarIcons[index];
              return (
                <MarketingRevealItem
                  key={item.title}
                  index={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-accent text-white">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </MarketingRevealItem>
              );
            })}
          </ul>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MarketingReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              {m.compareTitle}
            </h2>
            <p className="mt-4 text-muted-foreground">{m.compareSubtitle}</p>
          </MarketingReveal>
          <MarketingReveal className="mt-12 overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm" delay={0.1}>
            <div className="grid grid-cols-3 border-b border-border/80 bg-slate-50 text-sm font-semibold text-[#0F172A]">
              <div className="p-4 sm:p-5" />
              <div className="border-l border-border/80 p-4 text-muted-foreground sm:p-5">
                {m.typicalBoards}
              </div>
              <div className="border-l border-border/80 bg-brand-accent/5 p-4 text-brand-accent sm:p-5">
                {m.compareCrossTalent}
              </div>
            </div>
            {m.differentiators.map((row, i) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-3 text-sm sm:text-base",
                  i < m.differentiators.length - 1 && "border-b border-border/60"
                )}
              >
                <div className="p-4 font-medium text-[#0F172A] sm:p-5">
                  {row.label}
                </div>
                <div className="border-l border-border/60 p-4 text-muted-foreground sm:p-5">
                  {row.generic}
                </div>
                <div className="border-l border-border/60 bg-brand-accent/[0.03] p-4 font-medium text-[#0F172A] sm:p-5">
                  {row.crossTalent}
                </div>
              </div>
            ))}
          </MarketingReveal>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="border-y border-border/80 bg-slate-50/80 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {m.howItWorks}
          </h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <MarketingRevealItem
                  key={step.step}
                  index={index}
                  className="relative rounded-2xl border border-border/80 bg-white p-8 text-center shadow-sm"
                >
                  <span className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-brand-accent/20 bg-brand-accent/5 text-brand-accent">
                    <Icon className="size-7" strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-widest text-brand-accent">
                    {messages.marketing.forEmployers.stepLabel} {step.step}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </MarketingRevealItem>
              );
            })}
          </ol>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-[#0F172A]">
            {m.faqTitle}
          </h2>
          <dl className="mt-12 space-y-6">
            {m.faqs.map((faq, index) => (
              <MarketingRevealItem
                key={faq.question}
                index={index}
                as="div"
                className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm"
              >
                <dt className="text-lg font-semibold text-[#0F172A]">
                  {faq.question}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">
                  {faq.answer}
                </dd>
              </MarketingRevealItem>
            ))}
          </dl>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="bg-[#F8FAFC] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <MarketingRevealItem
              index={0}
              as="div"
              className="rounded-2xl border border-border/80 bg-white p-8 shadow-sm lg:p-10"
            >
              <Layers className="size-8 text-brand-accent" />
              <h3 className="mt-6 text-2xl font-semibold text-[#0F172A]">
                {m.candidateCardTitle}
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {m.candidateCardDesc}
              </p>
              <Link href={siteConfig.links.forCandidates} className="mt-8 inline-block">
                <Button size="lg" variant="brand" className="h-12 gap-2 px-8 text-base font-semibold">
                  {m.forJobSeekers}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </MarketingRevealItem>
            <MarketingRevealItem
              index={1}
              as="div"
              className="rounded-2xl border border-[#0F172A]/10 bg-[#0F172A] p-8 text-white lg:p-10"
            >
              <Briefcase className="size-8 text-brand-accent" />
              <h3 className="mt-6 text-2xl font-semibold">{m.employerCardTitle}</h3>
              <p className="mt-3 leading-relaxed text-slate-300">
                {m.employerCardDesc}
              </p>
              <Link
                href={siteConfig.links.forEmployers}
                className="mt-8 inline-block"
              >
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-white px-8 text-base font-semibold text-[#0F172A] hover:bg-slate-100"
                >
                  {m.startHiring}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link
                href={siteConfig.links.pricing}
                className="mt-4 block text-sm font-medium text-brand-accent hover:underline"
              >
                {m.viewEmployerPricing}
              </Link>
            </MarketingRevealItem>
          </div>
        </div>
      </MarketingRevealSection>
    </>
  );
}
