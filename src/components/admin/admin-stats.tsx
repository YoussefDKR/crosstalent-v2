"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import type { AdminStats } from "@/lib/admin/types";

type AdminStatsProps = {
  stats: AdminStats;
};

function StatCard({
  label,
  value,
  hint,
  href,
  format,
  viewLabel,
}: {
  label: string;
  value: number;
  hint?: string;
  href?: string;
  format?: "currency";
  viewLabel: string;
}) {
  const display =
    format === "currency"
      ? `€${value.toLocaleString("en-EU")}`
      : value.toLocaleString("en-EU");
  const content = (
    <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[#0F172A]">
        {display}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2563EB]">
          {viewLabel}
          <ChevronRight className="size-4" />
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

export function AdminStats({ stats }: AdminStatsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.signupsSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("admin.signupsToday")}
            value={stats.signupsToday}
            href="/admin/users"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.signupsThisWeek")}
            value={stats.signupsThisWeek}
            href="/admin/users"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.totalUsers")}
            value={stats.totalUsers}
            hint={t("admin.candidatesEmployers", {
              candidates: stats.totalCandidates,
              employers: stats.totalEmployers,
            })}
            href="/admin/users"
            viewLabel={t("admin.view")}
          />
          <StatCard label={t("admin.admins")} value={stats.totalAdmins} viewLabel={t("admin.view")} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.jobsSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("admin.statusPublished")}
            value={stats.jobsPublished}
            href="/admin/jobs?status=published"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.draftPending")}
            value={stats.jobsDraft}
            hint={t("admin.awaitingPublish")}
            href="/admin/jobs?status=draft"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.statusClosed")}
            value={stats.jobsClosed}
            href="/admin/jobs?status=closed"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.rssCurated")}
            value={stats.jobsRss}
            hint={t("admin.employerPostsHint", { count: stats.jobsPlatform })}
            href="/admin/jobs?source=rss"
            viewLabel={t("admin.view")}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.revenueSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label={t("admin.activeSubscriptions")}
            value={stats.activeSubscriptions}
            hint={t("admin.activeSubscriptionsHint")}
            href="/admin/subscriptions"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.estimatedMrr")}
            value={stats.estimatedMrr}
            format="currency"
            hint={t("admin.mrrHint")}
            href="/admin/subscriptions"
            viewLabel={t("admin.view")}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t("admin.applicationsSection")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label={t("admin.applicationsToday")}
            value={stats.applicationsToday}
            href="/admin/applications"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.totalApplications")}
            value={stats.totalApplications}
            href="/admin/applications"
            viewLabel={t("admin.view")}
          />
          <StatCard
            label={t("admin.pendingReview")}
            value={stats.pendingApplications}
            href="/admin/applications"
            viewLabel={t("admin.view")}
          />
        </div>
      </section>
    </div>
  );
}
