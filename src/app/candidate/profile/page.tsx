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

export const metadata: Metadata = {
  title: "My profile",
};

export default async function CandidateProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const data = await getCandidateProfileData(profile);
  const completion = calculateProfileCompletion(data);
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
          title="Professional summary"
          description="Headline, bio, location, and links employers see on your profile."
        >
          <ProfileDetailsForm details={data.details} />
        </SectionCard>

        <SectionCard
          id="cv"
          title="CV / Resume"
          description="Upload a PDF or Word document (max 5MB). Only verified employers can view it."
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
          title="Skills"
          description="Add technical and professional skills with optional proficiency levels."
        >
          <SkillsSection skills={data.skills} />
        </SectionCard>

        <SectionCard
          id="languages"
          title="Languages"
          description="Cross-border roles often require Arabic, French, or English."
        >
          <LanguagesSection languages={data.languages} />
        </SectionCard>

        <SectionCard
          id="experience"
          title="Work experience"
          description="Your employment history and achievements."
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
