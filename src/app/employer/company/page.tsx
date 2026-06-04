import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CompanyCompletionCard } from "@/components/employer/company-completion-card";
import { CompanyProfileForm } from "@/components/employer/company-profile-form";
import { EmployerAccountForm } from "@/components/employer/employer-account-form";
import { EmployerNav } from "@/components/employer/employer-nav";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { calculateCompanyCompletion } from "@/lib/employer/completion";
import { getCompanyProfileData } from "@/lib/employer/queries";

export const metadata: Metadata = {
  title: "Company profile",
};

export default async function EmployerCompanyPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const data = await getCompanyProfileData(profile);
  const completion = calculateCompanyCompletion(data);

  return (
    <DashboardShell
      profile={profile}
      title="Company profile"
      description="Showcase your company to attract talent across Morocco, Algeria, Tunisia, Egypt, and beyond."
    >
      <EmployerNav />

      <div className="mb-8">
        <CompanyCompletionCard completion={completion} compact />
      </div>

      <div className="space-y-8">
        <EmployerSectionCard
          title="Hiring contact"
          description="The person candidates and CrossTalent will reach out to."
        >
          <EmployerAccountForm
            fullName={data.profile.fullName}
            email={data.profile.email}
          />
        </EmployerSectionCard>

        <EmployerSectionCard
          title="Company details"
          description="This information appears on your job posts and employer brand page."
        >
          <CompanyProfileForm company={data.company} />
        </EmployerSectionCard>
      </div>
    </DashboardShell>
  );
}
