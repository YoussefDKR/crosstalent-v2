"use client";

import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Logo } from "@/components/shared/logo";
import { useI18n } from "@/context/i18n-provider";
import { navForRole } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types";

type AppTopBarProps = {
  profile: Profile;
  mobileNavSlot?: React.ReactNode;
};

export function AppTopBar({ profile, mobileNavSlot }: AppTopBarProps) {
  const { messages, t } = useI18n();
  const roleLabel =
    profile.role === "candidate"
      ? messages.auth.candidate
      : messages.auth.employer;
  const nav = navForRole(messages, profile.role);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Account navigation"
        >
          {nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-[#0F172A]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <div className="hidden items-center gap-3 sm:flex">
            <ProfileAvatar
              pathOrUrl={profile.avatarUrl}
              name={profile.fullName}
              size="sm"
            />
            <div className="hidden text-right md:block">
              <p className="max-w-[160px] truncate text-sm font-medium text-[#0F172A]">
                {profile.fullName ?? profile.email}
              </p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          {profile.role === "employer" && (
            <Link
              href={siteConfig.links.employerJobs}
              className="hidden rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] sm:inline-flex"
            >
              {t("employer.postAJob")}
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>
      {mobileNavSlot}
    </header>
  );
}
