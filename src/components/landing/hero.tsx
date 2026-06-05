"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/landing/hero-visual";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getDashboardPath } from "@/lib/auth/routes";
import type { Profile } from "@/types";

type HeroProps = {
  profile?: Profile | null;
};

export function Hero({ profile = null }: HeroProps) {
  const isGuest = !profile;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.25rem]"
            >
              Real talent.{" "}
              <span className="text-[#2563EB]">Global</span> opportunity.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
            >
              {profile?.role === "candidate"
                ? "Welcome back. Browse remote and hybrid roles with European companies, or finish your profile to stand out."
                : profile?.role === "employer"
                  ? "Manage your jobs and reach ambitious professionals across North Africa."
                  : "CrossTalent connects ambitious professionals from North Africa with European companies. Remote and hybrid jobs. Better futures for both."}
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
                      className="h-12 min-w-[200px] rounded-lg bg-[#2563EB] px-8 text-base font-semibold text-white shadow-md shadow-[#2563EB]/20 hover:bg-[#1d4ed8]"
                    >
                      {profile.role === "candidate"
                        ? "Find remote jobs"
                        : "Go to dashboard"}
                    </Button>
                  </Link>
                  <Link href={getDashboardPath(profile.role)}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 min-w-[200px] rounded-lg border-2 border-[#2563EB] px-8 text-base font-semibold text-[#2563EB] hover:bg-[#2563EB]/5"
                    >
                      {profile.role === "candidate"
                        ? "My dashboard"
                        : "Post a job"}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={siteConfig.links.forCandidates}>
                    <Button
                      size="lg"
                      className="h-12 min-w-[200px] rounded-lg bg-[#2563EB] px-8 text-base font-semibold text-white shadow-md shadow-[#2563EB]/20 hover:bg-[#1d4ed8]"
                    >
                      Find remote jobs
                    </Button>
                  </Link>
                  <Link href={siteConfig.links.forEmployers}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 min-w-[200px] rounded-lg border-2 border-[#2563EB] px-8 text-base font-semibold text-[#2563EB] hover:bg-[#2563EB]/5"
                    >
                      I&apos;m hiring talent
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
                className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sparkles className="size-4 text-[#2563EB]" aria-hidden />
                Early access beta — help us build the future of cross-border hiring
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
