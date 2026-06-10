import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { EmployerJobsList } from "@/components/employer/employer-jobs-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { getServerI18n } from "@/i18n/server";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import { getCurrentProfile } from "@/lib/auth/session";
import { listEmployerJobs } from "@/lib/jobs/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.jobsTitle") };
}

export default async function EmployerJobsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();
  const [jobs, access] = await Promise.all([
    listEmployerJobs(profile.id),
    getEmployerFeatureAccess(profile.id),
  ]);

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.jobsTitle")}
      description={t("employer.jobsSubtitle")}
    >
      {access.isTrialActive && (
        <p className="mb-4 rounded-lg bg-[#EFF6FF] px-4 py-3 text-sm text-[#1d4ed8]">
          {t(
            access.publishedJobCount === 1
              ? "employer.trialPublished"
              : "employer.trialPublishedPlural",
            {
              count: access.publishedJobCount,
              limit: access.publishedJobLimit ?? 0,
            }
          )}
          {access.trialDaysRemaining != null &&
            t(
              access.trialDaysRemaining === 1
                ? "employer.trialDaysLeftSingular"
                : "employer.trialDaysLeft",
              { days: access.trialDaysRemaining }
            )}
        </p>
      )}
      {!access.canPublishJobs && !access.isTrialActive && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("employer.draftJobsFree")}
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {jobs.length}{" "}
          {jobs.length === 1
            ? t("employer.postSingular")
            : t("employer.postPlural")}
        </p>
        <Link href="/employer/jobs/new">
          <Button className="gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            <Plus className="size-4" />
            {t("employer.postNewJob")}
          </Button>
        </Link>
      </div>

      <EmployerJobsList jobs={jobs} />
    </DashboardShell>
  );
}
