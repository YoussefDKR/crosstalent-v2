"use client";

import Link from "next/link";
import { Globe2, Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[#0F172A] p-10 text-white lg:flex xl:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, #2563EB 0%, transparent 45%), radial-gradient(circle at 90% 80%, #10B981 0%, transparent 40%)",
          }}
        />
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/10">
              <Globe2 className="size-5" />
            </span>
            <span className="text-lg font-semibold">{siteConfig.name}</span>
          </Link>
        </div>
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
            <Sparkles className="size-3.5 text-[#10B981]" />
            {t("auth.premiumTagline")}
          </p>
          <blockquote className="mt-8 text-2xl font-semibold leading-snug tracking-tight xl:text-3xl">
            &ldquo;{t("site.tagline")}&rdquo;
          </blockquote>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            {t("site.description")}
          </p>
        </div>
        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </aside>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#0F172A]"
            >
              <Globe2 className="size-4" />
              {siteConfig.name}
            </Link>
            <LanguageSwitcher />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
