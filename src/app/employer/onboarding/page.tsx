import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { EmployerOnboardingForm } from "@/components/employer/employer-onboarding-form";
import { Logo } from "@/components/shared/logo";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.onboardingPage.metadataTitle") };
}

export default async function EmployerOnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const data = await getCompanyProfileData(profile);
  if (isEmployerCompanyComplete(data.company)) {
    redirect("/employer/dashboard");
  }

  const { t } = await getServerI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F1F5F9] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white p-8 shadow-sm">
        <Logo className="mb-8" />
        <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
          {t("employer.onboardingPage.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("employer.onboardingPage.subtitle")}
        </p>
        <div className="mt-8">
          <EmployerOnboardingForm />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6 text-sm">
          <p className="text-center text-muted-foreground">
            {t("employer.onboardingPage.mistakeHint")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="font-medium text-[#2563EB] hover:underline"
            >
              {t("employer.onboardingPage.backHome")}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/jobs"
              className="font-medium text-[#2563EB] hover:underline"
            >
              {t("employer.onboardingPage.browseJobs")}
            </Link>
            <span className="text-muted-foreground">·</span>
            <SignOutButton variant="ghost" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
