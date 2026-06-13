import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminAnalyticsSection } from "@/components/admin/admin-analytics-section";
import { AdminRecentSignups } from "@/components/admin/admin-recent-signups";
import { AdminStats } from "@/components/admin/admin-stats";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getAdminAnalyticsDashboard,
  getAdminStats,
  listRecentSignups,
  resolveTrendDays,
} from "@/lib/admin/queries";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

type PageProps = {
  searchParams: Promise<{ days?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const params = await searchParams;
  const trendDays = resolveTrendDays(params.days);

  const { t } = await getServerI18n();
  const [stats, recentSignups, analytics] = await Promise.all([
    getAdminStats(),
    listRecentSignups(),
    getAdminAnalyticsDashboard(trendDays),
  ]);

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            {t("admin.dashboardTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("admin.dashboardSubtitle")}
          </p>
        </header>
        <AdminStats stats={stats} />
        <Suspense fallback={<div className="h-40 rounded-2xl bg-white" />}>
          <AdminAnalyticsSection data={analytics} />
        </Suspense>
        <AdminRecentSignups users={recentSignups} />
      </div>
    </AdminAppShell>
  );
}
