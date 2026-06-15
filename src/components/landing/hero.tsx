"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/landing/hero-visual";
import { MarketingGradientBg } from "@/components/marketing/marketing-gradient-bg";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { getDashboardPath } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

type HeroProps = {
  profile?: Profile | null;
};

export function Hero({ profile = null }: HeroProps) {
  const { t } = useI18n();
  const isGuest = !profile;

  const heroSubtitle =
    profile?.role === "candidate"
      ? t("landing.heroCandidate")
      : profile?.role === "employer"
        ? t("landing.heroEmployer")
        : t("landing.heroGuest");

  const outlineButtonClass = isGuest
    ? "h-12 min-w-[200px] rounded-lg border-2 border-white/25 bg-white/5 px-8 text-base font-semibold text-white hover:border-white/40 hover:bg-white/10"
    : "h-12 min-w-[200px] rounded-lg border-2 border-[#60A5FA] px-8 text-base font-semibold text-[#60A5FA] hover:bg-white/10";

  return (
    <section className="relative overflow-hidden bg-[#0F172A] pt-8 pb-16 text-white sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <MarketingGradientBg opacity={50} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            {isGuest && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
              >
                <Sparkles className="size-3.5 text-[#10B981]" aria-hidden />
                {t("auth.premiumTagline")}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: isGuest ? 0.06 : 0 }}
              className={cn(
                "text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]",
                isGuest && "mt-6"
              )}
            >
              {t("landing.heroTitle")}{" "}
              <span className="text-[#60A5FA]">{t("landing.heroHighlight")}</span>{" "}
              {t("landing.heroTitleEnd")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-6 text-lg leading-relaxed text-slate-300"
            >
              {heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              {profile ? (
                <>
                  <Link
                    href={
                      profile.role === "candidate"
                        ? siteConfig.links.jobs
                        : siteConfig.links.employerDashboard
                    }
                  >
                    <Button
                      size="lg"
                      className="h-12 min-w-[200px] rounded-lg bg-[#2563EB] px-8 text-base font-semibold text-white shadow-lg shadow-[#2563EB]/30 hover:bg-[#1d4ed8]"
                    >
                      {profile.role === "candidate"
                        ? t("landing.findRemoteJobs")
                        : t("landing.goToDashboard")}
                    </Button>
                  </Link>
                  <Link href={getDashboardPath(profile.role)}>
                    <Button size="lg" variant="outline" className={outlineButtonClass}>
                      {profile.role === "candidate"
                        ? t("landing.myDashboard")
                        : t("landing.postAJob")}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={siteConfig.links.forCandidates}>
                    <Button
                      size="lg"
                      className="h-12 min-w-[200px] rounded-lg bg-[#2563EB] px-8 text-base font-semibold text-white shadow-lg shadow-[#2563EB]/30 hover:bg-[#1d4ed8]"
                    >
                      {t("landing.findRemoteJobs")}
                    </Button>
                  </Link>
                  <Link href={siteConfig.links.forEmployers}>
                    <Button size="lg" variant="outline" className={outlineButtonClass}>
                      {t("landing.imHiring")}
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {isGuest && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400"
              >
                <Sparkles className="size-4 text-[#10B981]" aria-hidden />
                {t("landing.earlyAccess")}
              </motion.p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="pb-8 sm:pb-12"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
