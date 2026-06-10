"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import type { EmployerDashboardStats } from "@/lib/employer/dashboard";

type DashboardStatsProps = {
  stats: EmployerDashboardStats;
};

function StatCard({
  label,
  value,
  growth,
  href,
  linkLabel,
}: {
  label: string;
  value: number;
  growth?: string | null;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-4xl font-semibold tabular-nums tracking-tight text-[#0F172A]">
          {value}
        </p>
        {growth && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {growth}
          </span>
        )}
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB] hover:underline"
      >
        {linkLabel}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={t("employer.activeJobs")}
        value={stats.activeJobs}
        href="/employer/jobs"
        linkLabel={t("employer.viewJobs")}
      />
      <StatCard
        label={t("employer.applications")}
        value={stats.totalApplications}
        growth={stats.applicationsGrowth}
        href="/employer/applications"
        linkLabel={t("employer.viewAll")}
      />
      <StatCard
        label={t("employer.shortlisted")}
        value={stats.shortlisted}
        href="/employer/applications?status=accepted"
        linkLabel={t("employer.viewAll")}
      />
      <StatCard
        label={t("employer.inReview")}
        value={stats.inReview}
        href="/employer/applications?status=pending"
        linkLabel={t("employer.viewAll")}
      />
    </div>
  );
}
