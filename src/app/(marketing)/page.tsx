import { Hero } from "@/components/landing/hero";
import { BetaBanner } from "@/components/landing/beta-banner";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AudienceSplit } from "@/components/landing/audience-split";
import { CtaSection } from "@/components/landing/cta-section";
import { CandidateHome } from "@/components/home/candidate-home";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";

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
    redirect("/employer/dashboard");
  }

  return (
    <>
      <Hero profile={profile} />
      <BetaBanner />
      <HowItWorks />
      <AudienceSplit profile={profile} />
      <CtaSection profile={profile} />
    </>
  );
}
