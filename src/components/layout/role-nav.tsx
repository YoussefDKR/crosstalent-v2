"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  MessageSquare,
  UserCircle,
  Users,
} from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import {
  candidateNav,
  employerNav,
  isNavActive,
  type NavItem,
} from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const iconByHref: Record<string, typeof Home> = {
  "/": Home,
  "/jobs": Briefcase,
  "/candidate/dashboard": LayoutDashboard,
  "/candidate/profile": UserCircle,
  "/candidate/messages": MessageSquare,
  "/employer/dashboard": LayoutDashboard,
  "/employer/company": Building2,
  "/employer/jobs": Briefcase,
  "/employer/candidates": Users,
  "/employer/messages": MessageSquare,
  "/employer/billing": CreditCard,
};

function iconFor(item: NavItem) {
  if (item.href === "/employer/applications") return ClipboardList;
  return iconByHref[item.href] ?? Home;
}

type RoleNavProps = {
  role: UserRole;
  variant?: "sidebar" | "bar";
  className?: string;
  onNavigate?: () => void;
};

export function RoleNav({
  role,
  variant = "sidebar",
  className,
  onNavigate,
}: RoleNavProps) {
  const pathname = usePathname();
  const { messages } = useI18n();
  const items = role === "candidate" ? candidateNav(messages) : employerNav(messages);

  if (variant === "bar") {
    return (
      <nav
        className={cn(
          "flex gap-1 overflow-x-auto rounded-xl border border-border/80 bg-white p-1 shadow-sm",
          className
        )}
        aria-label={role === "candidate" ? "Candidate" : "Employer"}
      >
        {items.map((item) => {
          const active = isNavActive(pathname, item.href, item.matchHome);
          const Icon = iconFor(item);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#0F172A] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-[#0F172A]"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      className={cn("flex flex-col gap-1", className)}
      aria-label={role === "candidate" ? "Candidate" : "Employer"}
    >
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {role === "candidate"
          ? messages.auth.candidate
          : messages.auth.employer}
      </p>
      {items.map((item) => {
        const active = isNavActive(pathname, item.href, item.matchHome);
        const Icon = iconFor(item);
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#2563EB] text-white shadow-sm"
                : "text-[#0F172A]/80 hover:bg-white hover:text-[#0F172A]"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
