import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  employmentLabel,
  experienceLabel,
  locationLabel,
  remoteLabel,
} from "@/lib/jobs/labels";
import { resolveImageUrl } from "@/lib/images/urls";
import { formatSalaryRange } from "@/lib/jobs/format";
import { getPublishedJob } from "@/lib/jobs/queries";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCandidateApplicationForJob } from "@/lib/applications/queries";
import { JobApplySection } from "@/components/jobs/apply-to-job-button";
import { isRssJob, rssSourceLabel } from "@/lib/jobs/source";
import { getServerI18n } from "@/i18n/server";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublishedJob(id);
  return {
    title: job ? `${job.title} at ${job.company_name ?? "Company"}` : "Job",
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getPublishedJob(id);
  if (!job) notFound();

  const { t } = await getServerI18n();
  const profile = await getCurrentProfile();
  const application =
    profile?.role === "candidate"
      ? await getCandidateApplicationForJob(profile.id, id)
      : { applied: false, status: null, applicationId: null };
  const salary = formatSalaryRange(job);
  const logoUrl = resolveImageUrl(job.company_logo_url);

  return (
    <div className="bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
        >
          <ArrowLeft className="size-4" />
          {t("jobs.backToBoard")}
        </Link>

        <Card className="mt-8 border-border/80 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt=""
                    className="size-full object-contain p-1.5"
                  />
                ) : (
                  <Building2 className="size-6 text-[#0F172A]" />
                )}
              </span>
              <div>
                <p className="text-sm font-medium text-[#2563EB]">
                  {job.company_name ?? t("jobs.europeanEmployer")}
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-[#0F172A] sm:text-3xl">
                  {job.title}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-4" />
                  {locationLabel(job.location_city, job.location_country)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">{remoteLabel(job.remote_type)}</Badge>
              <Badge variant="secondary">
                {employmentLabel(job.employment_type)}
              </Badge>
              <Badge variant="secondary">
                {experienceLabel(job.experience_level)}
              </Badge>
            </div>

            {salary && (
              <p className="mt-4 text-lg font-semibold text-[#0F172A]">
                {salary}
              </p>
            )}

            <div className="mt-8 space-y-6">
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("jobs.aboutRole")}
                </h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[#0F172A]/90">
                  {job.description}
                </p>
              </section>

              {job.requirements && (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("jobs.requirements")}
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[#0F172A]/90">
                    {job.requirements}
                  </p>
                </section>
              )}

              {job.skills.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("jobs.skills")}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {job.languages.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("jobs.languages")}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <JobApplySection
              jobId={id}
              isCandidate={profile?.role === "candidate"}
              externalUrl={isRssJob(job) ? job.external_url : null}
              externalSourceLabel={rssSourceLabel(job.external_source)}
              application={application}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
