import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { EmployerJobsList } from "@/components/employer/employer-jobs-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/session";
import { listEmployerJobs } from "@/lib/jobs/queries";

export const metadata: Metadata = {
  title: "Job posts",
};

export default async function EmployerJobsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const jobs = await listEmployerJobs(profile.id);

  return (
    <DashboardShell
      profile={profile}
      title="Job posts"
      description="Create and manage roles visible on the public job board when published."
    >
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
