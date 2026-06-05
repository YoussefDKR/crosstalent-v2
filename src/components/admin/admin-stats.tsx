import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
}: {
  label: string;
  value: number;
  hint?: string;
  href?: string;
  format?: "currency";
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
          View
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
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Signups
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Signups today" value={stats.signupsToday} href="/admin/users" />
          <StatCard
            label="Signups this week"
            value={stats.signupsThisWeek}
            href="/admin/users"
          />
          <StatCard
            label="Total users"
            value={stats.totalUsers}
            hint={`${stats.totalCandidates} candidates · ${stats.totalEmployers} employers`}
            href="/admin/users"
          />
          <StatCard label="Admins" value={stats.totalAdmins} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Jobs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Published"
            value={stats.jobsPublished}
            href="/admin/jobs?status=published"
          />
          <StatCard
            label="Draft / pending"
            value={stats.jobsDraft}
            hint="Awaiting publish"
            href="/admin/jobs?status=draft"
          />
          <StatCard
            label="Closed"
            value={stats.jobsClosed}
            href="/admin/jobs?status=closed"
          />
          <StatCard
            label="RSS curated"
            value={stats.jobsRss}
            hint={`${stats.jobsPlatform} employer posts`}
            href="/admin/jobs?source=rss"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Revenue
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Active subscriptions"
            value={stats.activeSubscriptions}
            hint="Growth + Scale (active or trial)"
            href="/admin/subscriptions"
          />
          <StatCard
            label="Estimated MRR"
            value={stats.estimatedMrr}
            format="currency"
            hint="Based on plan list prices"
            href="/admin/subscriptions"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Applications
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Applications today"
            value={stats.applicationsToday}
            href="/admin/applications"
          />
          <StatCard
            label="Total applications"
            value={stats.totalApplications}
            href="/admin/applications"
          />
          <StatCard
            label="Pending review"
            value={stats.pendingApplications}
            href="/admin/applications"
          />
        </div>
      </section>
    </div>
  );
}
