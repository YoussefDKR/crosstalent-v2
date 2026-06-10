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
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { companyInitials, companyLogoColorClass } from "@/lib/jobs/format";
import { resolveImageUrl } from "@/lib/images/urls";
import { cn } from "@/lib/utils";

type EmployerSidebarProps = {
  companyName: string;
  companyLogoUrl: string | null;
  messageCount: number;
  pendingApplications: number;
  showCandidates?: boolean;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EmployerSidebar({
  companyName,
  companyLogoUrl,
  messageCount,
  pendingApplications,
  showCandidates = true,
}: EmployerSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const logoUrl = resolveImageUrl(companyLogoUrl);
  const initials = companyInitials(companyName);

  const links = [
    {
      href: "/employer/dashboard",
      label: t("common.dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: siteConfig.links.employerJobs,
      label: t("nav.jobs"),
      icon: Briefcase,
    },
    {
      href: "/employer/applications",
      label: t("nav.applications"),
      icon: ClipboardList,
    },
    {
      href: siteConfig.links.employerCandidates,
      label: t("nav.candidates"),
      icon: Users,
    },
    {
      href: siteConfig.links.employerMessages,
      label: t("nav.messages"),
      icon: MessageSquare,
      badgeKey: "messages" as const,
    },
    {
      href: siteConfig.links.employerCompany,
      label: t("employer.companyProfile"),
      icon: Building2,
    },
    {
      href: siteConfig.links.employerBilling,
      label: t("nav.billing"),
      icon: CreditCard,
    },
    {
      href: siteConfig.links.employerSettings,
      label: t("nav.settings"),
      icon: Settings,
    },
  ];

  const navLinks = showCandidates
    ? links
    : links.filter((l) => l.href !== siteConfig.links.employerCandidates);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-[#F8FAFC] lg:flex">
      <div className="shrink-0 px-4 pt-6 pb-4">
        <Link
          href={siteConfig.links.employerCompany}
          className="flex items-center gap-3 rounded-xl border border-border/80 bg-white p-3 shadow-sm transition-colors hover:border-[#2563EB]/30"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="size-11 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white",
                companyLogoColorClass(companyName)
              )}
            >
              {initials}
            </span>
          )}
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0F172A]">
            {companyName}
          </p>
        </Link>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-4 py-1"
        aria-label="Employer"
      >
        <div className="flex flex-col gap-1 pb-4">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            const badge =
              item.badgeKey === "messages"
                ? messageCount
                : item.href === "/employer/applications"
                  ? pendingApplications
                  : 0;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#2563EB]/10 text-[#2563EB]"
                    : "text-[#0F172A]/75 hover:bg-white hover:text-[#0F172A]"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#2563EB] text-[10px] font-semibold text-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border/60 bg-[#F8FAFC] px-4 py-5">
        <Link href="/employer/jobs/new" className="block">
          <Button
            size="lg"
            className="h-11 w-full gap-2 rounded-xl bg-[#2563EB] px-3 text-sm font-semibold text-white shadow-md shadow-[#2563EB]/25 hover:bg-[#1d4ed8]"
          >
            <Plus className="size-4 shrink-0" strokeWidth={2.5} />
            <span className="truncate">{t("employer.postNewJob")}</span>
          </Button>
        </Link>
      </div>
    </aside>
  );
}
