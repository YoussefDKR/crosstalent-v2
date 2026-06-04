import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountInfoForm } from "@/components/candidate/account-info-form";
import { ChangePasswordForm } from "@/components/candidate/change-password-form";
import { EmailUpdateForm } from "@/components/candidate/email-update-form";
import { ImageUpload } from "@/components/shared/image-upload";
import { SectionCard } from "@/components/candidate/section-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function CandidateSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  return (
    <DashboardShell profile={profile}>
      <div className="w-full">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
          Settings
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Your name, photo, email, and password. Career details live under{" "}
          <Link
            href="/candidate/profile"
            className="font-medium text-[#2563EB] hover:underline"
          >
            My profile
          </Link>
          .
        </p>

        <div className="mt-8 grid w-full gap-6 sm:grid-cols-2 sm:gap-8">
          <SectionCard
            title="Profile photo"
            description="Shown on your profile and when employers view you."
            className="sm:col-span-2"
          >
            <ImageUpload
              kind="avatar"
              uploadUrl="/api/upload/avatar"
              pathOrUrl={profile.avatarUrl}
              displayName={profile.fullName}
              label="Profile photo"
            />
          </SectionCard>

          <SectionCard
            title="Name"
            description="How your name appears across CrossTalent."
          >
            <AccountInfoForm fullName={profile.fullName} />
          </SectionCard>

          <SectionCard
            title="Email"
            description="Used to sign in and receive notifications."
          >
            <EmailUpdateForm email={profile.email} />
          </SectionCard>

          <SectionCard
            title="Password"
            description="Choose a strong password you do not use elsewhere."
            className="sm:col-span-2"
          >
            <ChangePasswordForm />
          </SectionCard>
        </div>
      </div>
    </DashboardShell>
  );
}
