import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountInfoForm } from "@/components/candidate/account-info-form";
import { ChangePasswordForm } from "@/components/candidate/change-password-form";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";
import { EmailUpdateForm } from "@/components/candidate/email-update-form";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { ImageUpload } from "@/components/shared/image-upload";
import { getCurrentProfile } from "@/lib/auth/session";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Profile — Admin",
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { t } = await getServerI18n();

  return (
    <AdminAppShell profile={profile}>
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            {t("admin.settingsTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("admin.settingsSubtitle")}
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <EmployerSectionCard
            title="Profile photo"
            description="Shown in the admin header."
            className="sm:col-span-2"
          >
            <ImageUpload
              kind="avatar"
              uploadUrl="/api/upload/avatar"
              pathOrUrl={profile.avatarUrl}
              displayName={profile.fullName}
              label="Profile photo"
            />
          </EmployerSectionCard>

          <EmployerSectionCard
            title="Name"
            description="Your display name on CrossTalent."
          >
            <AccountInfoForm fullName={profile.fullName} />
          </EmployerSectionCard>

          <EmployerSectionCard
            title="Email"
            description="Used to sign in to the admin dashboard."
          >
            <EmailUpdateForm email={profile.email} />
          </EmployerSectionCard>

          <EmployerSectionCard
            title="Password"
            description="Choose a strong password you do not use elsewhere."
            className="sm:col-span-2"
          >
            <ChangePasswordForm />
          </EmployerSectionCard>

          <EmployerSectionCard
            title="Delete account"
            description="Permanently remove your admin account after email confirmation."
            className="sm:col-span-2 border-red-200/80"
          >
            <DeleteAccountSection email={profile.email} />
          </EmployerSectionCard>
        </div>
      </div>
    </AdminAppShell>
  );
}
