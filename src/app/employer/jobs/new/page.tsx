import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JobForm } from "@/components/employer/job-form";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.newJobPage.title") };
}

export default async function NewJobPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.newJobPage.title")}
      description={t("employer.newJobPage.description")}
    >
      <Link
        href="/employer/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        {t("employer.newJobPage.back")}
      </Link>

      <EmployerSectionCard
        title={t("employer.newJobPage.sectionTitle")}
        description={t("employer.newJobPage.sectionDesc")}
      >
        <JobForm mode="create" />
      </EmployerSectionCard>
    </DashboardShell>
  );
}
