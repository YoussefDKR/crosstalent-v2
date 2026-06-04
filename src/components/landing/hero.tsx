"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, LayoutDashboard, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

type HeroProps = {
  profile?: Profile | null;
};

export function Hero({ profile = null }: HeroProps) {
  const dashboardHref = profile ? getDashboardPath(profile.role) : null;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#2563EB]/[0.07] blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[320px] w-[320px] rounded-full bg-[#10B981]/[0.06] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.06) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/5 px-4 py-1.5 text-[#2563EB]"
            >
              <Sparkles className="size-3.5" />
              {profile
                ? `Welcome back${profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}`
                : "Cross-border hiring, reimagined"}
            </Badge>
          </motion.div>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl lg:leading-[1.1]"
          >
            Great talent.{" "}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#10B981] bg-clip-text text-transparent">
              Better opportunities.
            </span>{" "}
            Beyond borders.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {profile?.role === "candidate"
              ? "Your profile is ready for European employers. Browse open roles or finish your profile to stand out."
              : profile?.role === "employer"
                ? "Manage your company, publish roles, and reach vetted talent across North Africa."
                : `${siteConfig.description} Join thousands of professionals and employers building teams across North Africa and Europe.`}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {profile && dashboardHref ? (
              <>
                {profile.role === "candidate" && (
                  <Link href={siteConfig.links.jobs}>
                    <Button
                      size="lg"
                      className="h-11 gap-2 bg-[#2563EB] px-6 text-base text-white shadow-md shadow-[#2563EB]/25 hover:bg-[#1d4ed8]"
                    >
                      Browse job board
                      <Briefcase className="size-4" />
                    </Button>
                  </Link>
                )}
                {profile.role === "employer" && (
                  <Link href={siteConfig.links.employerJobs}>
                    <Button
                      size="lg"
                      className="h-11 gap-2 bg-[#2563EB] px-6 text-base text-white shadow-md shadow-[#2563EB]/25 hover:bg-[#1d4ed8]"
                    >
                      Manage job posts
                      <Briefcase className="size-4" />
                    </Button>
                  </Link>
                )}
                <Link href={dashboardHref}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 gap-2 border-[#0F172A]/15 px-6 text-base text-[#0F172A] hover:bg-[#0F172A]/5"
                  >
                    <LayoutDashboard className="size-4" />
                    Go to dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={siteConfig.links.candidateSignup}>
                  <Button
                    size="lg"
                    className="h-11 gap-2 bg-[#2563EB] px-6 text-base text-white shadow-md shadow-[#2563EB]/25 hover:bg-[#1d4ed8]"
                  >
                    I&apos;m looking for work
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href={siteConfig.links.employerSignup}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 gap-2 border-[#0F172A]/15 px-6 text-base text-[#0F172A] hover:bg-[#0F172A]/5"
                  >
                    <Briefcase className="size-4" />
                    I&apos;m hiring talent
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.p
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-4 text-sm text-muted-foreground"
          >
            {profile
              ? "Use the header for Dashboard and Sign out anytime."
              : "Free for candidates · Paid plans for employers · No credit card to explore"}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="rounded-xl border border-border/80 bg-white p-2 shadow-xl shadow-[#0F172A]/[0.06] ring-1 ring-[#0F172A]/5">
            <div className="rounded-lg bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {profile ? "Your next step" : "Live matches today"}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#0F172A]">
                    {profile?.role === "candidate"
                      ? "Explore open roles"
                      : profile?.role === "employer"
                        ? "Publish a role"
                        : "127 new connections"}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1 text-sm font-medium text-[#059669]">
                  <span className="size-2 animate-pulse rounded-full bg-[#10B981]" />
                  {profile ? "Signed in" : "Active now"}
                </span>
              </div>
              <div
                className={`mt-6 grid gap-4 ${
                  profile?.role === "employer"
                    ? "sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-3"
                }`}
              >
                {profile?.role === "candidate" ? (
                  <>
                    <Link
                      href={siteConfig.links.jobs}
                      className="rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Job board</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Filter by skill, country, salary
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        View roles →
                      </p>
                    </Link>
                    <Link
                      href="/candidate/profile"
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Your profile</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        CV, skills, languages
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Edit profile →
                      </p>
                    </Link>
                    <Link
                      href={dashboardHref!}
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Dashboard</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Track completion
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Open →
                      </p>
                    </Link>
                  </>
                ) : profile?.role === "employer" ? (
                  <>
                    <Link
                      href={siteConfig.links.employerJobs}
                      className="rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Job posts</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Set status to Published to go live
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Manage →
                      </p>
                    </Link>
                    <Link
                      href={siteConfig.links.employerCandidates}
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Find talent</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Search by skills & country
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Search →
                      </p>
                    </Link>
                    <Link
                      href={siteConfig.links.employerCompany}
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Company</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Brand & hiring regions
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Edit →
                      </p>
                    </Link>
                    <Link
                      href={dashboardHref!}
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">Dashboard</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Overview & tips
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Open →
                      </p>
                    </Link>
                  </>
                ) : (
                  [
                    { label: "Senior React Dev", loc: "Casablanca → Paris", match: "94%" },
                    { label: "Data Analyst", loc: "Tunis → Berlin", match: "89%" },
                    { label: "UX Designer", loc: "Cairo → Madrid", match: "91%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-border/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="font-medium text-[#0F172A]">{item.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.loc}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[#2563EB]">
                        Match {item.match}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
