"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types";

type CtaSectionProps = {
  profile?: Profile | null;
};

export function CtaSection({ profile = null }: CtaSectionProps) {
  const dashboardHref = profile ? getDashboardPath(profile.role) : null;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl bg-[#0F172A] px-8 py-16 text-center shadow-xl sm:px-16 sm:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 50%, #10B981 0%, transparent 45%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {profile ? "Pick up where you left off" : "Ready to go beyond borders?"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              {profile?.role === "candidate"
                ? "Open roles from European employers are on the job board — only Published posts appear there."
                : profile?.role === "employer"
                  ? "Publish roles on the job board and search candidates by skills, languages, and country."
                  : "Whether you're building your career or your next great hire, CrossTalent is where MENA meets Europe."}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {profile && dashboardHref ? (
                <>
                  {profile.role === "candidate" ? (
                    <Link href={siteConfig.links.jobs}>
                      <Button
                        size="lg"
                        className="h-11 gap-2 bg-white px-6 text-[#0F172A] hover:bg-slate-100"
                      >
                        Browse job board
                        <Briefcase className="size-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href={siteConfig.links.employerJobs}>
                      <Button
                        size="lg"
                        className="h-11 gap-2 bg-white px-6 text-[#0F172A] hover:bg-slate-100"
                      >
                        Job posts
                        <Briefcase className="size-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={dashboardHref}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-11 border-slate-600 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={siteConfig.links.candidateSignup}>
                    <Button
                      size="lg"
                      className="h-11 gap-2 bg-white px-6 text-[#0F172A] hover:bg-slate-100"
                    >
                      Join as candidate
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  <Link href={siteConfig.links.employerSignup}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-11 border-slate-600 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                    >
                      Start hiring
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
