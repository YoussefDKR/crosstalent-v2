import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { EmployerJobsList } from "@/components/employer/employer-jobs-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import { getCurrentProfile } from "@/lib/auth/session";
import { listEmployerJobs } from "@/lib/jobs/queries";

export const metadata: Metadata = {
  title: "Job posts",
};

export default async function EmployerJobsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const [jobs, access] = await Promise.all([
    listEmployerJobs(profile.id),
    getEmployerFeatureAccess(profile.id),
  ]);

  return (
    <DashboardShell
      profile={profile}
      title="Job posts"
      description="Create and manage roles visible on the public job board when published."
    >
      {access.isTrialActive && (
        <p className="mb-4 rounded-lg bg-[#EFF6FF] px-4 py-3 text-sm text-[#1d4ed8]">
          Trial: {access.publishedJobCount}/{access.publishedJobLimit} job
          published on the board
          {access.trialDaysRemaining != null &&
            ` · ${access.trialDaysRemaining} days left`}
        </p>
      )}
      {!access.canPublishJobs && !access.isTrialActive && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Draft jobs are free. Subscribe or use your trial to publish on the job
          board.
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "post" : "posts"}
        </p>
        <Link href="/employer/jobs/new">
          <Button className="gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            <Plus className="size-4" />
            New job
          </Button>
        </Link>
      </div>

      <EmployerJobsList jobs={jobs} />
    </DashboardShell>
  );
}
