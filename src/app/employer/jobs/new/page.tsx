import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/employer/job-form";
import { EmployerNav } from "@/components/employer/employer-nav";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "New job post",
};

export default async function NewJobPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  return (
    <DashboardShell
      profile={profile}
      title="New job post"
      description="Draft a role and publish when you're ready for candidates to see it."
    >
      <EmployerNav />

      <Link
        href="/employer/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        Back to job posts
      </Link>

      <EmployerSectionCard
        title="Job details"
        description="Published jobs appear on /jobs for all visitors."
      >
        <JobForm mode="create" />
      </EmployerSectionCard>
    </DashboardShell>
  );
}
