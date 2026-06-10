import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyCompletionCard } from "@/components/employer/company-completion-card";
import { CompanyProfileForm } from "@/components/employer/company-profile-form";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { calculateCompanyCompletion } from "@/lib/employer/completion";
import { getCompanyProfileData } from "@/lib/employer/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.companyProfile") };
}

export default async function EmployerCompanyPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();
  const data = await getCompanyProfileData(profile);
  const completion = calculateCompanyCompletion(data);

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.companyProfile")}
      description={t("employer.companySubtitle")}
    >
      <div className="mb-8">
        <CompanyCompletionCard completion={completion} compact />
      </div>

      <p className="mb-6 text-sm text-muted-foreground">
        {t("employer.personalSettingsBefore")}{" "}
        <Link
          href="/employer/settings"
          className="font-medium text-[#2563EB] hover:underline"
        >
          {t("employer.settingsTitle")}
        </Link>
        {t("employer.personalSettingsAfter")}
      </p>

      <EmployerSectionCard
        title={t("employer.companyDetails")}
        description={t("employer.companyDetailsDesc")}
      >
        <CompanyProfileForm company={data.company} />
      </EmployerSectionCard>
    </DashboardShell>
  );
}
