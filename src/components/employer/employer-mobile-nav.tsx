"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function EmployerMobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const links = [
    { href: "/employer/dashboard", label: t("nav.dashboard") },
    { href: siteConfig.links.employerJobs, label: t("nav.jobs") },
    { href: "/employer/applications", label: t("nav.applications") },
    { href: siteConfig.links.employerMessages, label: t("nav.messages") },
    { href: siteConfig.links.employerSettings, label: t("nav.settings") },
  ];

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
