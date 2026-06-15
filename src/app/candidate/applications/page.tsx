import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CandidateAppShell } from "@/components/candidate/candidate-app-shell";
import { CandidateApplicationListItemCard } from "@/components/applications/candidate-application-list-item";
import { getCurrentProfile } from "@/lib/auth/session";
import { listCandidateApplications } from "@/lib/applications/queries";
import { getServerI18n } from "@/i18n/server";
import type { ApplicationStatus } from "@/types/applications";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("nav.myApplications") };
}

function statusLabel(
  status: ApplicationStatus,
  t: (key: string) => string
): string {
  const map: Record<ApplicationStatus, string> = {
    pending: t("jobs.applicationStatus.pending"),
    accepted: t("jobs.applicationStatus.accepted"),
    rejected: t("jobs.applicationStatus.rejected"),
  };
  return map[status];
}

export default async function CandidateApplicationsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t } = await getServerI18n();
  const applications = await listCandidateApplications(profile.id);

  return (
    <CandidateAppShell
      profile={profile}
      title={t("nav.myApplications")}
      description={t("candidate.applicationsSubtitle")}
    >
      {applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((application) => (
            <CandidateApplicationListItemCard
              key={application.id}
              application={application}
              statusLabel={statusLabel(application.status, t)}
              appliedOnLabel={t("candidate.appliedOn")}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-medium text-[#0F172A]">
            {t("candidate.noApplications")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("candidate.noApplicationsHint")}
          </p>
          <Link
            href="/jobs"
            className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
          >
            {t("jobs.browseJobs")}
          </Link>
        </div>
      )}
    </CandidateAppShell>
  );
}
