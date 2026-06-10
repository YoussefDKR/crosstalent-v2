import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminRevenueStatsPanel } from "@/components/admin/admin-revenue-stats";
import { AdminSubscriptionsTable } from "@/components/admin/admin-subscriptions-table";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getAdminRevenueStats,
  listAdminSubscriptions,
} from "@/lib/admin/queries";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Subscriptions & revenue — Admin",
};

export default async function AdminSubscriptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { t } = await getServerI18n();
  const [revenue, subscriptions] = await Promise.all([
    getAdminRevenueStats(),
    listAdminSubscriptions(),
  ]);

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            {t("admin.subscriptionsTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("admin.subscriptionsSubtitle")}
          </p>
        </header>

        <AdminRevenueStatsPanel stats={revenue} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {t("admin.allSubscriptions")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {subscriptions.length}{" "}
            {subscriptions.length === 1
              ? t("admin.recordSingular")
              : t("admin.recordPlural")}
          </p>
          <AdminSubscriptionsTable subscriptions={subscriptions} />
        </section>
      </div>
    </AdminAppShell>
  );
}
