"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: siteConfig.links.employerJobs, label: "Jobs" },
  { href: "/employer/applications", label: "Applications" },
  { href: siteConfig.links.employerMessages, label: "Messages" },
  { href: siteConfig.links.employerSettings, label: "Settings" },
];

export function EmployerMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-border/60 bg-white px-4 py-2 lg:hidden"
      aria-label="Employer mobile"
    >
      {links.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium",
              active
                ? "bg-[#2563EB] text-white"
                : "bg-slate-100 text-[#0F172A]/80"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
