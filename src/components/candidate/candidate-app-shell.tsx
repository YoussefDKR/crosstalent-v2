import { CandidateSidebar } from "@/components/candidate/candidate-sidebar";
import { CandidateMobileNav } from "@/components/candidate/candidate-mobile-nav";
import { SidebarProfileStrength } from "@/components/candidate/sidebar-profile-strength";
import { AppShellHeader } from "@/components/layout/app-shell-header";
import { listAppNotifications } from "@/lib/notifications/queries";
import type { Profile } from "@/types";

type CandidateAppShellProps = {
  profile: Profile;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export async function CandidateAppShell({
  profile,
  title,
  description,
  children,
}: CandidateAppShellProps) {
  const notifications = await listAppNotifications(profile);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <CandidateSidebar
        footer={<SidebarProfileStrength profile={profile} />}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppShellHeader profile={profile} notifications={notifications} />
        <CandidateMobileNav />

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {(title || description) && (
            <header className="mb-8">
              {title && (
                <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              )}
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
