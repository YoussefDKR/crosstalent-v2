import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountInfoForm } from "@/components/candidate/account-info-form";
import { ChangePasswordForm } from "@/components/candidate/change-password-form";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";
import { EmailUpdateForm } from "@/components/candidate/email-update-form";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { ImageUpload } from "@/components/shared/image-upload";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.settingsTitle") };
}

export default async function EmployerSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();

  return (
    <DashboardShell profile={profile}>
      <div className="w-full">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          {t("employer.settingsTitle")}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {t("employer.settingsDescBefore")}{" "}
          <Link
            href="/employer/company"
            className="font-medium text-[#2563EB] hover:underline"
          >
            {t("employer.companyProfile")}
          </Link>
          {t("employer.settingsDescAfter")}
        </p>

        <div className="mt-8 grid w-full gap-6 sm:grid-cols-2 sm:gap-8">
          <EmployerSectionCard
            title={t("employer.profilePhoto")}
            description={t("employer.profilePhotoDesc")}
            className="sm:col-span-2"
          >
            <ImageUpload
              kind="avatar"
              uploadUrl="/api/upload/avatar"
              pathOrUrl={profile.avatarUrl}
              displayName={profile.fullName}
              label={t("employer.profilePhoto")}
            />
          </EmployerSectionCard>

          <EmployerSectionCard
            title={t("employer.name")}
            description={t("employer.nameDesc")}
          >
            <AccountInfoForm fullName={profile.fullName} />
          </EmployerSectionCard>

          <EmployerSectionCard
            title={t("employer.email")}
            description={t("employer.emailDesc")}
          >
            <EmailUpdateForm email={profile.email} />
          </EmployerSectionCard>

          <EmployerSectionCard
            title={t("employer.password")}
            description={t("employer.passwordDesc")}
            className="sm:col-span-2"
          >
            <ChangePasswordForm />
          </EmployerSectionCard>

          <EmployerSectionCard
            title={t("employer.deleteAccount")}
            description={t("employer.deleteAccountDesc")}
            className="sm:col-span-2 border-red-200/80"
          >
            <DeleteAccountSection email={profile.email} />
          </EmployerSectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
