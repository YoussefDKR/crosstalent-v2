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
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate/profile", label: "My profile", icon: UserCircle },
  {
    href: "/",
    label: "Find jobs",
    icon: Search,
    match: (p: string) =>
      p === "/" || p === "/jobs" || p.startsWith("/jobs/"),
  },
  {
    href: "/candidate/dashboard",
    label: "My applications",
    icon: Briefcase,
    disabled: true,
    badge: "Soon",
  },
  {
    href: "#",
    label: "Saved jobs",
    icon: Bookmark,
    disabled: true,
  },
  {
    href: "#",
    label: "Job alerts",
    icon: Bell,
    disabled: true,
  },
  {
    href: siteConfig.links.candidateMessages,
    label: "Messages",
    icon: MessageSquare,
  },
  { href: "/candidate/settings", label: "Settings", icon: Settings },
];

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

  return (
      <aside className="hidden h-full min-h-screen w-64 shrink-0 flex-col bg-[#0F172A] px-4 py-6 text-white lg:flex">
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
