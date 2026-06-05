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

export const metadata: Metadata = {
  title: "Subscriptions & revenue — Admin",
};

export default async function AdminSubscriptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const [revenue, subscriptions] = await Promise.all([
    getAdminRevenueStats(),
    listAdminSubscriptions(),
  ]);

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            Subscriptions & revenue
          </h1>
          <p className="mt-2 text-muted-foreground">
            Employer billing across Growth (€199/mo) and Scale (€499/mo). MRR is
            estimated from active subscriptions at list price.
          </p>
        </header>

        <AdminRevenueStatsPanel stats={revenue} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            All employer subscriptions
          </h2>
          <p className="text-sm text-muted-foreground">
            {subscriptions.length}{" "}
            {subscriptions.length === 1 ? "record" : "records"}
          </p>
          <AdminSubscriptionsTable subscriptions={subscriptions} />
        </section>
      </div>
    </AdminAppShell>
  );
}
