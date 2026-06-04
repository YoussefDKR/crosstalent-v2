import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Link2,
  MapPin,
} from "lucide-react";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { StartConversationButton } from "@/components/employer/start-conversation-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  countryLabel,
  getCandidateForEmployer,
} from "@/lib/employer/candidate-search";
import {
  languageProficiencyLabel,
  skillLevelLabel,
} from "@/lib/employer/labels";

type CandidateDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: CandidateDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const candidate = await getCandidateForEmployer(id);
  return {
    title: candidate
      ? candidate.fullName ?? "Candidate profile"
      : "Candidate",
  };
}

function formatExperienceDates(
  start: string,
  end: string | null,
  isCurrent: boolean
): string {
  const startYear = start.slice(0, 4);
  const endPart = isCurrent ? "Present" : end ? end.slice(0, 4) : "";
  return endPart ? `${startYear} – ${endPart}` : startYear;
}

export default async function EmployerCandidateDetailPage({
  params,
}: CandidateDetailPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { id } = await params;
  const candidate = await getCandidateForEmployer(id);
  if (!candidate) notFound();

  const displayName = candidate.fullName ?? "Candidate";

  return (
    <DashboardShell
      profile={profile}
      title={displayName}
      description={candidate.headline ?? "Candidate profile"}
    >
      <Link
        href="/employer/candidates"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        Back to search
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <ProfileAvatar
                  pathOrUrl={candidate.avatarUrl}
                  name={displayName}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold text-[#0F172A]">
                      {displayName}
                    </h2>
                    <Badge variant="secondary">
                      Profile {candidate.completionPercent}% complete
                    </Badge>
                  </div>
                  {candidate.headline && (
                    <p className="mt-2 text-lg text-[#2563EB]">
                      {candidate.headline}
                    </p>
                  )}
                  <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {candidate.location
                      ? `${candidate.location}${candidate.countryCode ? ` · ${countryLabel(candidate.countryCode)}` : ""}`
                      : countryLabel(candidate.countryCode)}
                  </p>
                </div>
              </div>

              {candidate.bio && (
                <section className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    About
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[#0F172A]/90">
                    {candidate.bio}
                  </p>
                </section>
              )}

              {candidate.experiences.length > 0 && (
                <section className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Experience
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {candidate.experiences.map((exp) => (
                      <li
                        key={exp.id}
                        className="rounded-lg border border-border/60 p-4"
                      >
                        <p className="font-medium text-[#0F172A]">
                          {exp.title} · {exp.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatExperienceDates(
                            exp.startDate,
                            exp.endDate,
                            exp.isCurrent
                          )}
                          {exp.location ? ` · ${exp.location}` : ""}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[#0F172A]/80 whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium text-[#0F172A]">Contact & links</h3>
              {candidate.email && (
                <p className="text-sm text-muted-foreground break-all">
                  {candidate.email}
                </p>
              )}
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  <Link2 className="size-4" />
                  LinkedIn
                  <ExternalLink className="size-3" />
                </a>
              )}
              {candidate.portfolioUrl && (
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
                >
                  Portfolio
                  <ExternalLink className="size-3" />
                </a>
              )}
              {candidate.cvSignedUrl && (
                <a
                  href={candidate.cvSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-[#10B981]/40 text-[#047857] hover:bg-[#10B981]/5"
                  >
                    <FileText className="size-4" />
                    {candidate.cvFileName ?? "Download CV"}
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {candidate.skills.length > 0 && (
            <Card className="border-border/80 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-[#0F172A]">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                      {skill.level
                        ? ` · ${skillLevelLabel(skill.level)}`
                        : ""}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {candidate.languages.length > 0 && (
            <Card className="border-border/80 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-[#0F172A]">Languages</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {candidate.languages.map((lang) => (
                    <li
                      key={lang.id}
                      className="flex justify-between gap-2 text-[#0F172A]"
                    >
                      <span>{lang.language}</span>
                      <span className="text-muted-foreground">
                        {languageProficiencyLabel(lang.proficiency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="border-[#2563EB]/20 bg-[#2563EB]/5 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-[#0F172A]">
                Start a conversation — messages update in real time for both
                sides.
              </p>
              <StartConversationButton
                candidateId={candidate.id}
                candidateName={displayName}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
