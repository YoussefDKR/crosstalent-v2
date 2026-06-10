import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CvUpload } from "@/components/candidate/cv-upload";
import { ExperienceSection } from "@/components/candidate/experience-section";
import { LanguagesSection } from "@/components/candidate/languages-section";
import { ProfilePageHeader } from "@/components/candidate/profile-page-header";
import { ProfileCompletionCard } from "@/components/candidate/profile-completion";
import { ProfileDetailsForm } from "@/components/candidate/profile-details-form";
import { SectionCard } from "@/components/candidate/section-card";
import { SkillsSection } from "@/components/candidate/skills-section";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { calculateProfileCompletion } from "@/lib/candidate/completion";
import {
  getCandidateProfileData,
  getCvSignedUrl,
} from "@/lib/candidate/queries";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("candidate.profileTitle") };
}

export default async function CandidateProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t, messages } = await getServerI18n();
  const data = await getCandidateProfileData(profile);
  const completion = calculateProfileCompletion(
    data,
    messages.candidate.completionItems
  );
  const cvDownloadUrl = data.details?.cv_path
    ? await getCvSignedUrl(data.details.cv_path)
    : null;

  return (
    <DashboardShell profile={profile}>
      <ProfilePageHeader data={data} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
        <SectionCard
          id="about"
          title={t("candidate.sectionAboutTitle")}
          description={t("candidate.sectionAboutDesc")}
        >
          <ProfileDetailsForm details={data.details} />
        </SectionCard>

        <SectionCard
          id="cv"
          title={t("candidate.sectionCvTitle")}
          description={t("candidate.sectionCvDesc")}
        >
          <CvUpload
            userId={profile.id}
            cvFileName={data.details?.cv_file_name ?? null}
            cvUploadedAt={data.details?.cv_uploaded_at ?? null}
            downloadUrl={cvDownloadUrl}
          />
        </SectionCard>

        <SectionCard
          id="skills"
          title={t("candidate.sectionSkillsTitle")}
          description={t("candidate.sectionSkillsDesc")}
        >
          <SkillsSection skills={data.skills} />
        </SectionCard>

        <SectionCard
          id="languages"
          title={t("candidate.sectionLanguagesTitle")}
          description={t("candidate.sectionLanguagesDesc")}
        >
          <LanguagesSection languages={data.languages} />
        </SectionCard>

        <SectionCard
          id="experience"
          title={t("candidate.sectionExperienceTitle")}
          description={t("candidate.sectionExperienceDesc")}
        >
          <ExperienceSection experiences={data.experiences} />
        </SectionCard>
        </div>

        <aside className="h-fit">
          <ProfileCompletionCard completion={completion} />
        </aside>
      </div>
    </DashboardShell>
  );
}
