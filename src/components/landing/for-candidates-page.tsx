"use client";

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
import { BetaBanner } from "@/components/landing/beta-banner";
import {
  MarketingPageHero,
  marketingOutlineButtonClass,
  marketingPrimaryButtonClass,
} from "@/components/marketing/marketing-page-hero";
import {
  MarketingRevealItem,
  MarketingRevealSection,
} from "@/components/marketing/marketing-reveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

const benefitIcons = [Sparkles, Globe2, FileText, Briefcase] as const;
const profileIcons = [FileText, Languages, Sparkles, Globe2] as const;

export function ForCandidatesPage() {
  const { messages } = useI18n();
  const m = messages.marketing.forCandidates;

  const profileItems = [
    m.profileItem1,
    m.profileItem2,
    m.profileItem3,
    m.profileItem4,
  ];

  return (
    <>
      <MarketingPageHero
        eyebrow={m.eyebrow}
        eyebrowClassName="text-[#34D399]"
        title={
          <>
            {m.title}{" "}
            <span className="text-[#60A5FA]">{m.titleHighlight}</span>.
          </>
        }
        subtitle={m.subtitle}
        actions={
          <>
            <Link href={siteConfig.links.candidateSignup}>
              <Button size="lg" className={marketingPrimaryButtonClass}>
                {m.createAccount}
              </Button>
            </Link>
            <Link href={siteConfig.links.jobs}>
              <Button size="lg" variant="outline" className={marketingOutlineButtonClass}>
                {m.browseJobs}
              </Button>
            </Link>
          </>
        }
        note={
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="size-4 text-[#10B981]" />
            {m.freeNote}
          </span>
        }
        aside={
          <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/20 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {m.profileIncludes}
            </p>
            <ul className="mt-6 space-y-5">
              {profileItems.map((label, index) => {
                const Icon = profileIcons[index];
                return (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-medium text-[#0F172A]">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        }
      />

      <BetaBanner />

      <MarketingRevealSection className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              {m.benefitsTitle}
            </h2>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {m.benefits.map((item, index) => {
              const Icon = benefitIcons[index];
              return (
                <MarketingRevealItem
                  key={item.title}
                  index={index}
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
                </MarketingRevealItem>
              );
            })}
          </ul>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="border-y border-border/80 bg-[#0F172A] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            {m.threeStepsTitle}
          </h2>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {m.steps.map((step, index) => (
              <MarketingRevealItem
                key={step.title}
                index={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <span className="text-xs font-bold tracking-widest text-[#2563EB]">
                  {messages.marketing.forEmployers.stepLabel}{" "}
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {step.description}
                </p>
              </MarketingRevealItem>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href={siteConfig.links.candidateSignup}>
              <Button size="lg" variant="brand" className="h-12 px-10 text-base font-semibold">
                {m.createYourProfile}
              </Button>
            </Link>
          </div>
        </div>
      </MarketingRevealSection>

      <MarketingRevealSection className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-[#0F172A]">
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
                <dt className="font-semibold text-[#0F172A]">{faq.question}</dt>
                <dd className="mt-2 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </dd>
              </MarketingRevealItem>
            ))}
          </dl>
        </div>
      </MarketingRevealSection>

      <MarketingCtaBand
        title={m.ctaTitle}
        description={m.ctaDesc}
        primaryHref={siteConfig.links.candidateSignup}
        primaryLabel={m.ctaPrimary}
        secondaryHref={siteConfig.links.jobs}
        secondaryLabel={m.ctaSecondary}
      />
    </>
  );
}
