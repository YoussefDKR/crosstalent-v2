import { EmployerSidebar } from "@/components/employer/employer-sidebar";
import { EmployerMobileNav } from "@/components/employer/employer-mobile-nav";
import { EmployerMobilePostJob } from "@/components/employer/employer-mobile-post-job";
import { AppShellHeader } from "@/components/layout/app-shell-header";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { listAppNotifications } from "@/lib/notifications/queries";
import type { Profile } from "@/types";

type EmployerAppShellProps = {
  profile: Profile;
  children: React.ReactNode;
};

export async function EmployerAppShell({
  profile,
  children,
}: EmployerAppShellProps) {
  const [companyData, notifications, featureAccess] = await Promise.all([
    getCompanyProfileData(profile),
    listAppNotifications(profile),
    getEmployerFeatureAccess(profile.id),
  ]);

  const messageCount = notifications.filter((n) => n.type === "message").length;
  const pendingApplications = notifications.filter(
    (n) => n.type === "application"
  ).length;

  const companyName =
    companyData.company?.company_name?.trim() || "Your company";
  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <EmployerSidebar
        companyName={companyName}
        companyLogoUrl={companyData.company?.logo_url ?? null}
        messageCount={messageCount}
        pendingApplications={pendingApplications}
        showCandidates={featureAccess.canViewCandidates}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppShellHeader
          profile={profile}
          notifications={notifications}
          mobileTitle={companyName}
        />
        <EmployerMobilePostJob />
        <EmployerMobileNav />

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
