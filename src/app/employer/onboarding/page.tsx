import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmployerOnboardingForm } from "@/components/employer/employer-onboarding-form";
import { Logo } from "@/components/shared/logo";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";

export const metadata: Metadata = {
  title: "Company setup",
};

export default async function EmployerOnboardingPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const data = await getCompanyProfileData(profile);
  if (isEmployerCompanyComplete(data.company)) {
    redirect("/employer/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F1F5F9] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white p-8 shadow-sm">
        <Logo className="mb-8" />
        <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
          Set up your company
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Before you start hiring, tell us your company name and website.
        </p>
        <div className="mt-8">
          <EmployerOnboardingForm />
        </div>
      </div>
    </div>
  );
}
