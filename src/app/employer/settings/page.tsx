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
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function EmployerSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  return (
    <DashboardShell profile={profile}>
      <div className="w-full">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Settings
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Your personal account — photo, name, email, and password. Company
          details live under{" "}
          <Link
            href="/employer/company"
            className="font-medium text-[#2563EB] hover:underline"
          >
            Company profile
          </Link>
          .
        </p>

        <div className="mt-8 grid w-full gap-6 sm:grid-cols-2 sm:gap-8">
          <EmployerSectionCard
            title="Profile photo"
            description="Shown when you message candidates and in your account."
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
            description="Your name as the hiring contact on CrossTalent."
          >
            <AccountInfoForm fullName={profile.fullName} />
          </EmployerSectionCard>

          <EmployerSectionCard
            title="Email"
            description="Used to sign in and receive notifications."
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
            description="Permanently remove your account after email confirmation."
            className="sm:col-span-2 border-red-200/80"
          >
            <DeleteAccountSection email={profile.email} />
          </EmployerSectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
