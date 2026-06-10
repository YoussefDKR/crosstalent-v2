"use client";

import Link from "next/link";
import { Globe2 } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

export function Footer() {
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t("footer.product"),
      links: [
        { label: t("nav.whyCrossTalent"), href: siteConfig.links.whyCrossTalent },
        { label: t("nav.jobBoard"), href: siteConfig.links.jobs },
        { label: t("footer.pricing"), href: siteConfig.links.pricing },
      ],
    },
    {
      title: t("footer.forTalent"),
      links: [
        { label: t("nav.forJobSeekers"), href: siteConfig.links.forCandidates },
        { label: t("footer.signUpFree"), href: siteConfig.links.candidateSignup },
        { label: t("footer.browseJobs"), href: siteConfig.links.jobs },
      ],
    },
    {
      title: t("footer.forEmployers"),
      links: [
        { label: t("nav.forEmployers"), href: siteConfig.links.forEmployers },
        { label: t("footer.createAccount"), href: siteConfig.links.employerSignup },
        { label: t("footer.pricing"), href: siteConfig.links.pricing },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.contact"), href: siteConfig.links.contact },
        { label: t("footer.privacy"), href: siteConfig.links.privacy },
        { label: t("footer.terms"), href: siteConfig.links.terms },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-[#0F172A] text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white">
                <Globe2 className="size-5" aria-hidden />
              </span>
              <span className="text-base font-semibold text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {t("site.tagline")}
            </p>
            <p className="mt-2 text-sm text-slate-500">{t("site.description")}</p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label + link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. {t("site.rights")}
          </p>
          <p className="text-sm text-slate-500">{t("site.footerTagline")}</p>
        </div>
      </div>
    </footer>
  );
}
