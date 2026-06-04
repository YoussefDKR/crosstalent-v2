import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/employer/job-form";
import { EmployerNav } from "@/components/employer/employer-nav";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerJob } from "@/lib/jobs/queries";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export async function generateMetadata({
  params,
}: EditJobPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") return { title: "Edit job" };
  const job = await getEmployerJob(profile.id, id);
  return { title: job ? `Edit: ${job.title}` : "Edit job" };
}

export default async function EditJobPage({
  params,
  searchParams,
}: EditJobPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { id } = await params;
  const job = await getEmployerJob(profile.id, id);
  if (!job) notFound();

  const query = await searchParams;
  const justCreated = query.created === "1";

  return (
    <DashboardShell
      profile={profile}
      title="Edit job post"
      description={job.title}
    >
      <EmployerNav />

      {justCreated && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Job saved as <strong>Draft</strong>. Set status to <strong>Published</strong> below
          and click Save — or use <strong>Publish to job board</strong> on the job posts
          list — so candidates see it at /jobs.
        </p>
      )}

      <Link
        href="/employer/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        Back to job posts
      </Link>

      <EmployerSectionCard
        title="Job details"
        description="Changes save immediately. Published jobs are visible at /jobs."
      >
        <JobForm mode="edit" job={job} />
      </EmployerSectionCard>
    </DashboardShell>
  );
}
