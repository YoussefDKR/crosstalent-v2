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
import { formatJobDescription } from "@/lib/jobs/import-helpers";
import { getPublishedJob } from "@/lib/jobs/queries";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCandidateApplicationForJob } from "@/lib/applications/queries";
import { getApplyBlockers } from "@/lib/candidate/apply-readiness";
import { getCandidateProfileData } from "@/lib/candidate/queries";
import { getSavedJobIds } from "@/lib/candidate/saved-jobs";
import { JobApplySection } from "@/components/jobs/apply-to-job-button";
import { JobPostingJsonLd } from "@/components/jobs/job-posting-json-ld";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { MarketingPageHero } from "@/components/marketing/marketing-page-hero";
import { metaDescriptionFromJob } from "@/lib/seo/job-posting";
import { isRssJob, rssSourceLabel } from "@/lib/jobs/source";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublishedJob(id);
  if (!job) return { title: "Job" };

  const companyName = job.company_name ?? "Company";
  const title = `${job.title} at ${companyName}`;
  const description = metaDescriptionFromJob(job);
  const canonical = `${siteConfig.url.replace(/\/$/, "")}/jobs/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
  const applyBlockers =
    profile?.role === "candidate" && !application.applied
      ? getApplyBlockers(await getCandidateProfileData(profile))
      : [];
  const savedJobIds =
    profile?.role === "candidate"
      ? await getSavedJobIds(profile.id)
      : new Set<string>();
  const salary = formatSalaryRange(job);
  const logoUrl = resolveImageUrl(job.company_logo_url);
  const description = formatJobDescription(job.description);

  const companyName = job.company_name ?? t("jobs.europeanEmployer");
  const location = locationLabel(job.location_city, job.location_country);

  return (
    <>
      <JobPostingJsonLd job={job} />
      <MarketingPageHero
        eyebrow={companyName}
        title={job.title}
        subtitle={
          <span className="inline-flex items-center justify-center gap-2">
            <MapPin className="size-4 shrink-0 text-[#34D399]" />
            {location}
          </span>
        }
      />

      <div className="bg-slate-50/80 py-12 sm:py-16">
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
                    {companyName}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#0F172A]">
                    {job.title}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    {location}
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
                  {description}
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
              applyBlockers={applyBlockers}
              saveJobSlot={
                profile?.role === "candidate" ? (
                  <SaveJobButton
                    jobId={id}
                    initialSaved={savedJobIds.has(id)}
                  />
                ) : null
              }
            />
          </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
