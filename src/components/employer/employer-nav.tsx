"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Applications", icon: ClipboardList, matchHome: true },
  { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employer/company", label: "Company profile", icon: Building2 },
  { href: "/employer/jobs", label: "Job posts", icon: Briefcase },
  { href: "/employer/candidates", label: "Find talent", icon: Users },
  { href: "/employer/messages", label: "Messages", icon: MessageSquare },
  { href: "/employer/billing", label: "Billing", icon: CreditCard },
];

export function EmployerNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex gap-1 overflow-x-auto rounded-lg border border-border bg-white p-1 shadow-sm"
      aria-label="Employer"
    >
      {links.map(({ href, label, icon: Icon, matchHome }) => {
        const active = matchHome
          ? pathname === "/" ||
            pathname.startsWith("/employer/applications")
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#0F172A] text-white"
                : "text-muted-foreground hover:bg-muted hover:text-[#0F172A]"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
