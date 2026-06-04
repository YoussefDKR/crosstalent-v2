"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { getDashboardPath } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Stories" },
  { href: siteConfig.links.pricing, label: "Pricing" },
  { href: siteConfig.links.jobs, label: "Jobs" },
];

type HeaderProps = {
  profile?: Profile | null;
};

export function Header({ profile = null }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dashboardHref = profile ? getDashboardPath(profile.role) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-[#0F172A]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {profile && dashboardHref ? (
            <>
              <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                {profile.fullName ?? profile.email}
              </span>
              {profile.role === "candidate" && (
                <Link href={siteConfig.links.jobs}>
                  <Button
                    size="sm"
                    className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                  >
                    Job board
                  </Button>
                </Link>
              )}
              {profile.role === "employer" && (
                <>
                  <Link href={siteConfig.links.employerCandidates}>
                    <Button variant="ghost" size="sm">
                      Find talent
                    </Button>
                  </Link>
                  <Link href={siteConfig.links.employerJobs}>
                    <Button
                      size="sm"
                      className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                    >
                      Job posts
                    </Button>
                  </Link>
                </>
              )}
              <Link href={dashboardHref}>
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href={siteConfig.links.login}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href={siteConfig.links.signup}>
                <Button
                  size="sm"
                  className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-[#0F172A]"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                {profile && dashboardHref ? (
                  <>
                    {profile.role === "candidate" && (
                      <Link
                        href={siteConfig.links.jobs}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                          Job board
                        </Button>
                      </Link>
                    )}
                    {profile.role === "employer" && (
                      <Link
                        href={siteConfig.links.employerJobs}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                          Job posts
                        </Button>
                      </Link>
                    )}
                    <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <SignOutButton className="w-full" />
                  </>
                ) : (
                  <>
                    <Link href={siteConfig.links.login}>
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href={siteConfig.links.signup}>
                      <Button className="w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                        Get started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
