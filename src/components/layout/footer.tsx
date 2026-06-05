import Link from "next/link";
import { Globe2 } from "lucide-react";
import { siteConfig } from "@/config/site";

const footerLinks = {
  Product: [
    { label: "Why CrossTalent", href: siteConfig.links.whyCrossTalent },
    { label: "Job board", href: siteConfig.links.jobs },
    { label: "Pricing", href: siteConfig.links.pricing },
  ],
  "For talent": [
    { label: "For job seekers", href: siteConfig.links.forCandidates },
    { label: "Sign up free", href: siteConfig.links.candidateSignup },
    { label: "Browse jobs", href: siteConfig.links.jobs },
  ],
  "For employers": [
    { label: "For employers", href: siteConfig.links.forEmployers },
    { label: "Create account", href: siteConfig.links.employerSignup },
    { label: "Pricing", href: siteConfig.links.pricing },
  ],
  Company: [
    { label: "Contact", href: siteConfig.links.contact },
    { label: "Privacy", href: siteConfig.links.privacy },
    { label: "Terms", href: siteConfig.links.terms },
  ],
};

export function Footer() {
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
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-500">{siteConfig.description}</p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
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
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Connecting MENA talent with European opportunity.
          </p>
        </div>
      </div>
    </footer>
  );
}
