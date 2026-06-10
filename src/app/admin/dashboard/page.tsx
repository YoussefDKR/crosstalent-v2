import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminAnalyticsCharts } from "@/components/admin/admin-analytics-charts";
import { AdminRecentSignups } from "@/components/admin/admin-recent-signups";
import { AdminStats } from "@/components/admin/admin-stats";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getAdminAnalyticsDashboard,
  getAdminStats,
  listRecentSignups,
} from "@/lib/admin/queries";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { t } = await getServerI18n();
  const [stats, recentSignups, analytics] = await Promise.all([
    getAdminStats(),
    listRecentSignups(),
    getAdminAnalyticsDashboard(),
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
        <AdminAnalyticsCharts data={analytics} />
        <AdminRecentSignups users={recentSignups} />
      </div>
    </AdminAppShell>
  );
}
