import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CandidateAppShell } from "@/components/candidate/candidate-app-shell";
import { JobListingCard } from "@/components/jobs/job-listing-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { listSavedJobs } from "@/lib/candidate/saved-jobs";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("nav.savedJobs") };
}

export default async function SavedJobsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t } = await getServerI18n();
  const jobs = await listSavedJobs(profile.id);
  const savedIds = new Set(jobs.map((job) => job.id));

  return (
    <CandidateAppShell
      profile={profile}
      title={t("nav.savedJobs")}
      description={t("jobs.savedJobsSubtitle")}
    >
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <JobListingCard job={job} savedJobIds={savedIds} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <p className="font-medium text-[#0F172A]">{t("jobs.noSavedJobs")}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("jobs.noSavedJobsHint")}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
          >
            {t("jobs.browseJobs")}
          </Link>
        </div>
      )}
    </CandidateAppShell>
  );
}
