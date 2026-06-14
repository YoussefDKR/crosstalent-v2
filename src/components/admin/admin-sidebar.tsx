"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Mail,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const links = [
    { href: "/admin/dashboard", label: t("admin.overview"), icon: LayoutDashboard },
    { href: "/admin/users", label: t("nav.users"), icon: Users },
    { href: "/admin/jobs", label: t("nav.jobs"), icon: Briefcase },
    {
      href: "/admin/applications",
      label: t("nav.applications"),
      icon: ClipboardList,
    },
    {
      href: "/admin/subscriptions",
      label: t("nav.subscriptions"),
      icon: CreditCard,
    },
    {
      href: "/admin/email-preview",
      label: "Email previews",
      icon: Mail,
    },
    { href: "/admin/settings", label: t("admin.profile"), icon: Settings },
  ];

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0F172A] lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
          <Shield className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{siteConfig.name}</p>
          <p className="text-xs text-slate-400">{t("admin.adminLabel")}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(pathname, href)
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/jobs"
          className="text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          {t("admin.viewJobBoard")}
        </Link>
      </div>
    </aside>
  );
}
