import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/employer/job-form";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerJob } from "@/lib/jobs/queries";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
};

export async function generateMetadata({
  params,
}: EditJobPageProps): Promise<Metadata> {
  const { t } = await getServerI18n();
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return { title: t("employer.editJobPage.metadataTitle") };
  }
  const job = await getEmployerJob(profile.id, id);
  return {
    title: job
      ? `${t("employer.editJobPage.metadataTitle")}: ${job.title}`
      : t("employer.editJobPage.metadataTitle"),
  };
}

export default async function EditJobPage({
  params,
  searchParams,
}: EditJobPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();
  const { id } = await params;
  const job = await getEmployerJob(profile.id, id);
  if (!job) notFound();

  const query = await searchParams;
  const justCreated = query.created === "1";

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.editJobPage.title")}
      description={job.title}
    >
      {justCreated && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {t("employer.editJobPage.createdBanner")}
        </p>
      )}

      <Link
        href="/employer/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        {t("employer.editJobPage.back")}
      </Link>

      <EmployerSectionCard
        title={t("employer.editJobPage.sectionTitle")}
        description={t("employer.editJobPage.sectionDesc")}
      >
        <JobForm mode="edit" job={job} />
      </EmployerSectionCard>
    </DashboardShell>
  );
}
