import { Hero } from "@/components/landing/hero";
import { BetaBanner } from "@/components/landing/beta-banner";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AudienceBento } from "@/components/landing/audience-bento";
import { AudienceSplit } from "@/components/landing/audience-split";
import { CtaSection } from "@/components/landing/cta-section";
import { CandidateHome } from "@/components/home/candidate-home";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";

type LandingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LandingPage({ searchParams }: LandingPageProps) {
  const profile = await getCurrentProfile();
  const params = await searchParams;

  if (profile?.role === "candidate") {
    return <CandidateHome profile={profile} searchParams={params} />;
  }

  if (profile?.role === "employer") {
    const data = await getCompanyProfileData(profile);
    if (isEmployerCompanyComplete(data.company)) {
      redirect("/employer/dashboard");
    }
    // Incomplete setup: show the public homepage so they can browse jobs or sign out.
  }

  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return (
    <>
      <Hero profile={profile} />
      <BetaBanner />
      <HowItWorks />
      <AudienceBento />
      <AudienceSplit profile={profile} />
      <CtaSection profile={profile} />
    </>
  );
}
