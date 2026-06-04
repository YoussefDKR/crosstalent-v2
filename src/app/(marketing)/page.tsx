import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AudienceSplit } from "@/components/landing/audience-split";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";
import { CandidateHome } from "@/components/home/candidate-home";
import { EmployerHome } from "@/components/home/employer-home";
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
    return <EmployerHome profile={profile} />;
  }

  return (
    <>
      <Hero profile={profile} />
      <Stats />
      <HowItWorks />
      <AudienceSplit profile={profile} />
      <Testimonials />
      <CtaSection profile={profile} />
    </>
  );
}
