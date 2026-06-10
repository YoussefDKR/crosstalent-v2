"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/context/i18n-provider";
import {
  marketingNav,
  navForRole,
  isNavActive,
} from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { getDashboardPath } from "@/lib/auth/routes";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notifications";
import type { Profile } from "@/types";

type HeaderProps = {
  profile?: Profile | null;
  notifications?: AppNotification[];
};

export function Header({
  profile = null,
  notifications = [],
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { messages, t } = useI18n();
  const isLoggedIn = Boolean(profile);
  const isMarketingGuest = !profile;
  const navLinks = profile
    ? navForRole(messages, profile.role)
    : marketingNav(messages);

  const authActions = isLoggedIn && profile ? (
    <>
      <NotificationMenu notifications={notifications} role={profile.role} />
      <div className="flex items-center gap-3 border-l border-border/60 pl-3">
        <ProfileAvatar
          pathOrUrl={profile.avatarUrl}
          name={profile.fullName}
          size="sm"
        />
        <span className="max-w-[140px] truncate text-sm font-medium text-[#0F172A]">
          {profile.fullName ?? profile.email}
        </span>
      </div>
      <Link href={getDashboardPath(profile.role)}>
        <Button
          size="sm"
          className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          {t("common.dashboard")}
        </Button>
      </Link>
      <SignOutButton />
    </>
  ) : (
    <>
      <LanguageSwitcher compact />
      <Link href={siteConfig.links.login}>
        <Button
          variant="ghost"
          size="lg"
          className="h-11 px-6 text-base font-semibold text-[#0F172A] hover:bg-slate-100"
        >
          {t("common.login")}
        </Button>
      </Link>
      <Link href={siteConfig.links.signup}>
        <Button
          size="lg"
          className="h-11 rounded-lg bg-[#2563EB] px-7 text-base font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
        >
          {t("common.signup")}
        </Button>
      </Link>
    </>
  );

  const nav = (
    <nav
      className={cn(
        "hidden items-center gap-6 whitespace-nowrap md:flex lg:gap-8",
        isMarketingGuest ? "justify-self-center" : "ml-8 lg:ml-10"
      )}
      aria-label="Main"
    >
      {navLinks.map((link) => {
        const active = isNavActive(pathname, link.href, link.matchHome);
        return (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors",
              active
                ? "text-[#2563EB]"
                : "text-[#0F172A]/70 hover:text-[#0F172A]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const headerPadding =
    "px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/95 backdrop-blur-md">
      {isMarketingGuest ? (
        <>
          <div
            className={cn(
              "flex h-[4.25rem] w-full items-center md:hidden",
              headerPadding
            )}
          >
            <Logo className="shrink-0" />
            <button
              type="button"
              className="ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
          <div
            className={cn(
              "hidden h-[4.25rem] w-full grid-cols-[1fr_auto_1fr] items-center md:grid",
              headerPadding
            )}
          >
            <Logo className="justify-self-start" />
            {nav}
            <div className="flex shrink-0 items-center justify-self-end gap-3">
              {isLoggedIn && <LanguageSwitcher compact />}
              {authActions}
            </div>
          </div>
        </>
      ) : (
        <div
          className={cn(
            "flex h-[4.25rem] w-full items-center",
            headerPadding
          )}
        >
          <Logo className="shrink-0" />
          {nav}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <LanguageSwitcher compact />
            {authActions}
          </div>
          <button
            type="button"
            className="ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      )}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-[#0F172A]"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {isLoggedIn && profile ? (
                  <>
                    <NotificationMenu
                      notifications={notifications}
                      role={profile.role}
                    />
                    <Link
                      href={getDashboardPath(profile.role)}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button className="w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                        {t("common.dashboard")}
                      </Button>
                    </Link>
                    <SignOutButton className="w-full" />
                  </>
                ) : (
                  <>
                    <LanguageSwitcher className="px-1" />
                    <Link href={siteConfig.links.login}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 w-full text-base font-semibold"
                      >
                        {t("common.login")}
                      </Button>
                    </Link>
                    <Link href={siteConfig.links.signup}>
                      <Button
                        size="lg"
                        className="h-12 w-full bg-[#2563EB] text-base font-semibold text-white hover:bg-[#1d4ed8]"
                      >
                        {t("common.signup")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
