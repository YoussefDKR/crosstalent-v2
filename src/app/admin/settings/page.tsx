import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountInfoForm } from "@/components/candidate/account-info-form";
import { ChangePasswordForm } from "@/components/candidate/change-password-form";
import { EmailUpdateForm } from "@/components/candidate/email-update-form";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { EmployerSectionCard } from "@/components/employer/section-card";
import { ImageUpload } from "@/components/shared/image-upload";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profile — Admin",
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  return (
    <AdminAppShell profile={profile}>
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            Admin profile
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your personal account — photo, name, email, and password.
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
        </div>
      </div>
    </AdminAppShell>
  );
}
