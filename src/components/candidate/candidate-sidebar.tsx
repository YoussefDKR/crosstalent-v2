"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Briefcase,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  UserCircle,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(
  pathname: string,
  href: string,
  match?: (p: string) => boolean
) {
  if (match) return match(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

type CandidateSidebarProps = {
  footer?: React.ReactNode;
};

export function CandidateSidebar({ footer }: CandidateSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  const links = [
    {
      href: "/candidate/dashboard",
      label: t("common.dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/candidate/profile",
      label: t("nav.myProfile"),
      icon: UserCircle,
    },
    {
      href: "/",
      label: t("nav.findJobs"),
      icon: Search,
      match: (p: string) =>
        p === "/" || p === "/jobs" || p.startsWith("/jobs/"),
    },
    {
      href: "/candidate/dashboard",
      label: t("nav.myApplications"),
      icon: Briefcase,
      disabled: true,
      badge: t("common.soon"),
    },
    {
      href: "/candidate/saved-jobs",
      label: t("nav.savedJobs"),
      icon: Bookmark,
    },
    {
      href: "/candidate/job-alerts",
      label: t("nav.jobAlerts"),
      icon: Bell,
    },
    {
      href: siteConfig.links.candidateMessages,
      label: t("nav.messages"),
      icon: MessageSquare,
    },
    {
      href: "/candidate/settings",
      label: t("nav.settings"),
      icon: Settings,
    },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-[#0F172A] px-4 py-6 text-white lg:flex">
      <Logo variant="light" className="mb-8 px-2" />

      <nav className="flex flex-1 flex-col gap-1" aria-label="Candidate">
        {links.map((item) => {
          const active = !item.disabled && isActive(pathname, item.href, item.match);
          const Icon = item.icon;

          if (item.disabled) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/35"
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {footer}
    </aside>
  );
}
