import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountInfoForm } from "@/components/candidate/account-info-form";
import { ChangePasswordForm } from "@/components/candidate/change-password-form";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";
import { EmailUpdateForm } from "@/components/candidate/email-update-form";
import { ImageUpload } from "@/components/shared/image-upload";
import { SectionCard } from "@/components/candidate/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("candidate.settingsTitle") };
}

export default async function CandidateSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t } = await getServerI18n();

  return (
    <DashboardShell profile={profile}>
      <div className="w-full">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          {t("candidate.settingsTitle")}
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {t("candidate.settingsPageDesc")}{" "}
          <Link
            href="/candidate/profile"
            className="font-medium text-[#2563EB] hover:underline"
          >
            {t("candidate.profileTitle")}
          </Link>
          .
        </p>

        <div className="mt-8 grid w-full gap-6 sm:grid-cols-2 sm:gap-8">
          <SectionCard
            title={t("candidate.settingsPhotoTitle")}
            description={t("candidate.settingsPhotoDesc")}
            className="sm:col-span-2"
          >
            <ImageUpload
              kind="avatar"
              uploadUrl="/api/upload/avatar"
              pathOrUrl={profile.avatarUrl}
              displayName={profile.fullName}
              label={t("candidate.settingsPhotoLabel")}
            />
          </SectionCard>

          <SectionCard
            title={t("candidate.settingsNameTitle")}
            description={t("candidate.settingsNameDesc")}
          >
            <AccountInfoForm fullName={profile.fullName} />
          </SectionCard>

          <SectionCard
            title={t("candidate.settingsEmailTitle")}
            description={t("candidate.settingsEmailDesc")}
          >
            <EmailUpdateForm email={profile.email} />
          </SectionCard>

          <SectionCard
            title={t("candidate.settingsPasswordTitle")}
            description={t("candidate.settingsPasswordDesc")}
            className="sm:col-span-2"
          >
            <ChangePasswordForm />
          </SectionCard>

          <SectionCard
            title={t("candidate.settingsDeleteTitle")}
            description={t("candidate.settingsDeleteDesc")}
            className="sm:col-span-2 border-red-200/80"
          >
            <DeleteAccountSection email={profile.email} />
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
