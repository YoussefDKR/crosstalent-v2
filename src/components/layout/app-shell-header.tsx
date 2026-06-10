"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import type { AppNotification } from "@/types/notifications";
import type { Profile } from "@/types";

type AppShellHeaderProps = {
  profile: Profile;
  notifications: AppNotification[];
  mobileTitle?: string;
};

export function AppShellHeader({
  profile,
  notifications,
  mobileTitle = "CrossTalent",
}: AppShellHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-white px-4 sm:px-6 lg:px-10">
      <div className="truncate text-sm font-semibold text-[#0F172A] lg:hidden">
        {mobileTitle}
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher compact className="lg:hidden" />
        <NotificationMenu notifications={notifications} role={profile.role} />
        <div className="flex items-center gap-3 border-l border-border/60 pl-3 sm:pl-4">
          <ProfileAvatar
            pathOrUrl={profile.avatarUrl}
            name={profile.fullName}
            size="sm"
          />
          <span className="hidden max-w-[160px] truncate text-sm font-medium text-[#0F172A] sm:inline">
            {profile.fullName ?? profile.email}
          </span>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
