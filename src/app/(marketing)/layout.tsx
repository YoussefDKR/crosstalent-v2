import { MarketingHeader } from "@/components/layout/marketing-header";
import { Footer } from "@/components/layout/footer";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { CandidateAppShell } from "@/components/candidate/candidate-app-shell";
import { EmployerAppShell } from "@/components/employer/employer-app-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";

/** Auth-aware header needs fresh session cookies (avoid static marketing shell). */
export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (profile?.role === "candidate") {
    return <CandidateAppShell profile={profile}>{children}</CandidateAppShell>;
  }

  if (profile?.role === "employer") {
    const data = await getCompanyProfileData(profile);
    if (isEmployerCompanyComplete(data.company)) {
      return <EmployerAppShell profile={profile}>{children}</EmployerAppShell>;
    }
    // Incomplete company setup: use the public marketing shell (header + footer).
  }

  if (profile?.role === "admin") {
    return <AdminAppShell profile={profile}>{children}</AdminAppShell>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingHeader profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
