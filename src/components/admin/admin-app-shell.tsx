import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AppShellHeader } from "@/components/layout/app-shell-header";
import type { Profile } from "@/types";

type AdminAppShellProps = {
  profile: Profile;
  children: React.ReactNode;
};

export function AdminAppShell({ profile, children }: AdminAppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppShellHeader
          profile={profile}
          notifications={[]}
          mobileTitle="Admin"
        />
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
