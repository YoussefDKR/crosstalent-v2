import Link from "next/link";
import { Plus } from "lucide-react";
import { EmployerSidebar } from "@/components/employer/employer-sidebar";
import { EmployerMobileNav } from "@/components/employer/employer-mobile-nav";
import { AppShellHeader } from "@/components/layout/app-shell-header";
import { Button } from "@/components/ui/button";
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
  const [companyData, notifications] = await Promise.all([
    getCompanyProfileData(profile),
    listAppNotifications(profile),
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
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppShellHeader
          profile={profile}
          notifications={notifications}
          mobileTitle={companyName}
        />
        <div className="shrink-0 border-b border-[#2563EB]/20 bg-[#2563EB] px-4 py-3 lg:hidden">
          <Link href="/employer/jobs/new" className="block">
            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-xl bg-white text-base font-semibold text-[#2563EB] shadow-sm hover:bg-white/95"
            >
              <Plus className="size-5" strokeWidth={2.5} />
              Post a new job
            </Button>
          </Link>
        </div>
        <EmployerMobileNav />

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
