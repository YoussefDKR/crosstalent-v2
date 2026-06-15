"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

const cardEase = [0.22, 1, 0.36, 1] as const;

type BentoCardProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "accent";
};

function BentoCard({
  children,
  className,
  delay = 0,
  variant = "default",
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, delay, ease: cardEase }}
      whileHover={{
        y: -4,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={cn(
        "relative z-0 overflow-hidden rounded-2xl border p-5 shadow-lg transition-[border-color,box-shadow,z-index] duration-300 hover:z-10 sm:p-6",
        variant === "accent"
          ? "border-[#2563EB]/60 bg-[#2563EB] text-white shadow-[#2563EB]/25 hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.45)]"
          : "border-white/10 bg-[#1e293b]/90 text-white hover:border-[#2563EB]/35 hover:shadow-[0_20px_40px_-12px_rgba(15,23,42,0.55)]",
        className
      )}
    >
      <div className="relative">{children}</div>
    </motion.div>
  );
}

function PillTags({
  tags,
  delay = 0,
}: {
  tags: readonly string[];
  delay?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + index * 0.04, duration: 0.35 }}
          className="rounded-full border border-white/10 bg-[#0F172A]/50 px-3 py-1 text-xs font-medium text-slate-200 transition-colors hover:border-[#2563EB]/30 hover:bg-[#2563EB]/15"
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}

function WorkModelDonut({
  segments,
}: {
  segments: readonly { label: string; color: string; share: number }[];
}) {
  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const start = cursor;
      cursor += segment.share;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-4">
      <div
        className="size-20 shrink-0 rounded-full shadow-inner ring-2 ring-white/10"
        style={{ background: `conic-gradient(${gradient})` }}
        aria-hidden
      />
      <ul className="space-y-1.5 text-xs text-slate-300">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            {segment.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AudienceBento() {
  const { messages } = useI18n();
  const b = messages.marketing.bento;

  const workModels = [
    { label: b.workRemote, color: "#10B981", share: 50 },
    { label: b.workHybrid, color: "#2563EB", share: 50 },
  ] as const;

  return (
    <section className="bg-[#0F172A] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-[#60A5FA]">
            {b.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {b.title}
          </h2>
          <p className="mt-4 text-lg text-slate-400">{b.subtitle}</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 lg:gap-4 [&>*]:min-w-0">
          <BentoCard delay={0.05} className="lg:col-start-1 lg:row-start-1">
            <p className="text-sm leading-relaxed text-slate-300">
              {b.menaMarketsPrefix}{" "}
              <span className="text-3xl font-bold text-[#F97316]">5+</span>{" "}
              {b.menaMarketsSuffix}
            </p>
          </BentoCard>

          <BentoCard
            delay={0.1}
            className="sm:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-1"
          >
            <PillTags tags={b.talentRoles} delay={0.12} />
            <p className="mt-4 text-xs text-slate-500">{b.talentFootnote}</p>
          </BentoCard>

          <BentoCard delay={0.15} className="lg:col-start-4 lg:row-start-1">
            <p className="text-sm text-slate-300">{b.freePrefix}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-transparent bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] bg-clip-text">
              100%
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              {b.freeSuffix}
            </p>
          </BentoCard>

          <BentoCard delay={0.2} className="lg:col-start-1 lg:row-start-2">
            <PillTags tags={b.employerMarkets} delay={0.22} />
            <p className="mt-4 text-xs text-slate-500">{b.employerFootnote}</p>
          </BentoCard>

          <BentoCard
            delay={0.25}
            variant="accent"
            className="flex min-h-[200px] items-center justify-center sm:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-2 lg:row-span-2"
          >
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">
                {b.centerEyebrow}
              </p>
              <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {b.centerTitle}
              </p>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/85">
                {b.centerDesc}
              </p>
            </div>
          </BentoCard>

          <BentoCard delay={0.3} className="lg:col-start-4 lg:row-start-2">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {b.workModelsTitle}
            </p>
            <WorkModelDonut segments={workModels} />
          </BentoCard>

          <BentoCard
            delay={0.35}
            className="lg:col-span-2 lg:col-start-1 lg:row-start-3"
          >
            <p className="text-sm text-slate-400">{b.skillsIntro}</p>
            <p className="mt-2 text-xl font-semibold sm:text-2xl">
              <span className="text-[#10B981]">{b.skillsHighlight}</span>
            </p>
            <PillTags tags={b.skillTags} delay={0.38} />
          </BentoCard>

          <BentoCard delay={0.4} className="lg:col-start-4 lg:row-start-3">
            <p className="text-sm text-slate-300">{b.languagesPrefix}</p>
            <p className="mt-2 text-3xl font-bold text-[#38BDF8]">3</p>
            <p className="mt-1 text-sm font-medium text-white">
              {b.languagesSuffix}
            </p>
            <p className="mt-3 text-xs text-slate-500">{b.languagesList}</p>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
