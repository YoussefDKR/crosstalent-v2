import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { ApplicationActions } from "@/components/employer/application-actions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getEmployerApplication } from "@/lib/applications/queries";
import { markApplicationViewed } from "@/lib/applications/views";
import { countryLabel } from "@/lib/employer/candidate-search";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ApplicationDetailPageProps): Promise<Metadata> {
  const { t } = await getServerI18n();
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return { title: t("employer.applicationTitle") };
  }
  const { id } = await params;
  const app = await getEmployerApplication(profile.id, id);
  return {
    title: app
      ? `${app.candidateName} — ${app.jobTitle}`
      : t("employer.applicationTitle"),
  };
}

export default async function EmployerApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t, locale } = await getServerI18n();
  const { id } = await params;
  const application = await getEmployerApplication(profile.id, id);
  if (!application) notFound();

  await markApplicationViewed(id, profile.id);

  const appliedDate = new Date(application.createdAt).toLocaleDateString(
    locale,
    { dateStyle: "long" }
  );

  return (
    <DashboardShell
      profile={profile}
      title={application.candidateName}
      description={t("employer.appliedTo", { jobTitle: application.jobTitle })}
    >
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        {t("employer.backToApplications")}
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <ProfileAvatar
                pathOrUrl={application.candidateAvatarUrl}
                name={application.candidateName}
                size="lg"
                className="size-16"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-[#0F172A]">
                    {application.candidateName}
                  </h2>
                  <Badge variant="secondary">
                    {t(`employer.applicationStatuses.${application.status}`)}
                  </Badge>
                </div>
                {application.candidateHeadline && (
                  <p className="mt-1 text-[#2563EB]">
                    {application.candidateHeadline}
                  </p>
                )}
                {application.candidateCountryCode && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    {countryLabel(application.candidateCountryCode)}
                  </p>
                )}
              </div>
            </div>

            {application.candidateBio && (
              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("employer.about")}
                </h3>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[#0F172A]/90">
                  {application.candidateBio}
                </p>
              </section>
            )}

            {application.candidateSkills.length > 0 && (
              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("employer.skills")}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {application.candidateSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-8">
              <ApplicationActions
                applicationId={application.id}
                status={application.status}
                candidateName={application.candidateName}
              />
            </div>

            <Link
              href={`/employer/candidates/${application.candidateId}`}
              className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
            >
              {t("employer.viewFullProfile")}
            </Link>
          </CardContent>
        </Card>

        <Card className="h-fit border-border/80 shadow-sm">
          <CardContent className="p-6">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Briefcase className="size-4" />
              {t("employer.appliedToLabel")}
            </p>
            <p className="mt-2 font-semibold text-[#0F172A]">
              {application.jobTitle}
            </p>
            <p className="mt-4 line-clamp-6 text-sm text-muted-foreground">
              {application.jobDescription}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {t("employer.appliedOn", { date: appliedDate })}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
