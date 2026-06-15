"use client";

import {
  Briefcase,
  ClipboardCheck,
  Globe2,
  MessageSquare,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

const stepIcons = {
  user: UserRound,
  search: Search,
  globe: Globe2,
  apply: ClipboardCheck,
  message: MessageSquare,
  briefcase: Briefcase,
} as const;

type StepIconKey = keyof typeof stepIcons;

type StepCard = {
  title: string;
  description: string;
  icon: StepIconKey;
};

function StepCardContent({
  step,
  Icon,
}: {
  step: StepCard;
  Icon: LucideIcon;
}) {
  return (
    <article
      className={cn(
        "flex w-[min(100%,320px)] shrink-0 flex-col rounded-xl border border-border bg-white p-8 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:border-[#2563EB]/30 hover:shadow-md"
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full border-2 border-[#2563EB]/20 bg-[#2563EB]/5 text-[#2563EB]">
        <Icon className="size-7" strokeWidth={1.75} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">{step.title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {step.description}
      </p>
    </article>
  );
}

function MarqueeRow({
  steps,
  rowId,
}: {
  steps: StepCard[];
  rowId: string;
}) {
  return (
    <div className="flex shrink-0 gap-6 pe-6">
      {steps.map((step) => {
        const Icon = stepIcons[step.icon];
        return (
          <StepCardContent
            key={`${rowId}-${step.icon}-${step.title}`}
            step={step}
            Icon={Icon}
          />
        );
      })}
    </div>
  );
}

export function HowItWorks() {
  const { t } = useI18n();

  const steps: StepCard[] = [
    {
      title: t("landing.step1Title"),
      description: t("landing.step1Description"),
      icon: "user",
    },
    {
      title: t("landing.step2Title"),
      description: t("landing.step2Description"),
      icon: "search",
    },
    {
      title: t("landing.step3Title"),
      description: t("landing.step3Description"),
      icon: "globe",
    },
    {
      title: t("landing.step4Title"),
      description: t("landing.step4Description"),
      icon: "apply",
    },
    {
      title: t("landing.step5Title"),
      description: t("landing.step5Description"),
      icon: "message",
    },
    {
      title: t("landing.step6Title"),
      description: t("landing.step6Description"),
      icon: "briefcase",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {t("landing.howItWorksTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.howItWorksSubtitle")}
          </p>
        </div>

        <div className="group/how-marquee relative mt-16 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-24"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-24"
            aria-hidden
          />

          <div className="how-it-works-marquee flex w-max motion-reduce:animate-none">
            <MarqueeRow steps={steps} rowId="a" />
            <MarqueeRow steps={steps} rowId="b" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
