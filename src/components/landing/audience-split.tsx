"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, GraduationCap, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { getDashboardPath } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types";

type AudienceSplitProps = {
  profile?: Profile | null;
};

export function AudienceSplit({ profile = null }: AudienceSplitProps) {
  const { messages } = useI18n();
  const a = messages.marketing.audience;

  const candidateHref =
    profile?.role === "candidate"
      ? siteConfig.links.jobs
      : siteConfig.links.forCandidates;
  const candidateLabel =
    profile?.role === "candidate" ? a.browseJobBoard : a.learnMore;
  const employerHref =
    profile?.role === "employer"
      ? siteConfig.links.employerJobs
      : siteConfig.links.forEmployers;
  const employerLabel =
    profile?.role === "employer" ? a.manageJobPosts : a.learnMore;

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border bg-white p-8 shadow-sm lg:p-10"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <GraduationCap className="size-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-[#0F172A]">
              {a.candidatesTitle}
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {a.candidatesDesc}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[#0F172A]/80">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-[#10B981]" />
                {a.candidatesBullet1}
              </li>
              <li className="flex items-center gap-2">
                <Shield className="size-4 text-[#10B981]" />
                {a.candidatesBullet2}
              </li>
            </ul>
            <Link href={candidateHref} className="mt-8 inline-block">
              <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                {candidateLabel}
              </Button>
            </Link>
            {profile?.role === "candidate" && (
              <Link
                href={getDashboardPath("candidate")}
                className="mt-3 block text-sm font-medium text-[#2563EB] hover:underline"
              >
                {a.goToDashboard}
              </Link>
            )}
          </motion.div>

          <motion.div
            id="for-employers"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="scroll-mt-24 rounded-lg border border-[#0F172A]/10 bg-[#0F172A] p-8 text-white shadow-sm lg:p-10"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-white/10">
              <Building2 className="size-6" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold">{a.employersTitle}</h3>
            <p className="mt-3 leading-relaxed text-slate-300">{a.employersDesc}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-[#10B981]" />
                {a.employersBullet1}
              </li>
              <li className="flex items-center gap-2">
                <Shield className="size-4 text-[#10B981]" />
                {a.employersBullet2}
              </li>
            </ul>
            <Link href={employerHref} className="mt-8 inline-block">
              <Button className="bg-white text-[#0F172A] hover:bg-slate-100">
                {employerLabel}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
