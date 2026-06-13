import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CandidateAppShell } from "@/components/candidate/candidate-app-shell";
import { JobAlertForm } from "@/components/candidate/job-alert-form";
import { JobAlertsList } from "@/components/candidate/job-alerts-list";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  jobAlertToFilters,
  listJobAlerts,
} from "@/lib/candidate/job-alerts";
import { jobMatchesFilters } from "@/lib/jobs/match-filters";
import { listPublishedJobs } from "@/lib/jobs/queries";
import { getServerI18n } from "@/i18n/server";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("nav.jobAlerts") };
}

export default async function JobAlertsPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const params = await searchParams;
  const { t } = await getServerI18n();
  const alerts = await listJobAlerts(profile.id);
  const { jobs } = await listPublishedJobs({});

  const matchCounts: Record<string, number> = {};
  for (const alert of alerts) {
    if (!alert.is_active) {
      matchCounts[alert.id] = 0;
      continue;
    }
    const filters = jobAlertToFilters(alert);
    matchCounts[alert.id] = jobs.filter((job) =>
      jobMatchesFilters(job, filters)
    ).length;
  }

  const get = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  return (
    <CandidateAppShell
      profile={profile}
      title={t("nav.jobAlerts")}
      description={t("jobs.jobAlertsSubtitle")}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            {t("jobs.createAlert")}
          </h2>
          <JobAlertForm
            defaultValues={{
              q: get("q"),
              country: get("country"),
              employmentType: get("employmentType"),
              remoteType: get("remoteType"),
              experienceLevel: get("experienceLevel"),
              skill: get("skill"),
              salaryMin: get("salaryMin"),
            }}
          />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
            {t("jobs.yourAlerts")}
          </h2>
          <JobAlertsList alerts={alerts} matchCounts={matchCounts} />
        </div>
      </div>
    </CandidateAppShell>
  );
}
