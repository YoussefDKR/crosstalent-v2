import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardGreeting } from "@/components/employer/dashboard-greeting";
import { DashboardStats } from "@/components/employer/dashboard-stats";
import { RecentApplicationsPanel } from "@/components/employer/recent-applications-panel";
import { TopJobPerformance } from "@/components/employer/top-job-performance";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerDashboardData } from "@/lib/employer/dashboard";

export const metadata: Metadata = {
  title: "Employer dashboard",
};

export default async function EmployerDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { stats, recentApplications, topJob } =
    await getEmployerDashboardData(profile.id);
  const firstName = profile.fullName?.split(/\s+/)[0] ?? null;

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-8">
        <DashboardGreeting firstName={firstName} />
        <DashboardStats stats={stats} />
        <RecentApplicationsPanel applications={recentApplications} />
        <TopJobPerformance job={topJob} />
      </div>
    </DashboardShell>
  );
}
