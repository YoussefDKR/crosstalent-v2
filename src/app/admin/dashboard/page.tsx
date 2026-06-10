import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminRecentSignups } from "@/components/admin/admin-recent-signups";
import { AdminSignupCountries } from "@/components/admin/admin-signup-countries";
import { AdminStats } from "@/components/admin/admin-stats";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getAdminStats,
  getSignupCountryStats,
  listRecentSignups,
} from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const [stats, recentSignups, countryStats] = await Promise.all([
    getAdminStats(),
    listRecentSignups(),
    getSignupCountryStats(),
  ]);

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
            Platform overview
          </h1>
          <p className="mt-2 text-muted-foreground">
            Signups, jobs, and applications across CrossTalent.
          </p>
        </header>
        <AdminStats stats={stats} />
        <AdminSignupCountries stats={countryStats} />
        <AdminRecentSignups users={recentSignups} />
      </div>
    </AdminAppShell>
  );
}
