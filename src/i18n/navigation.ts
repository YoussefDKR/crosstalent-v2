import { siteConfig } from "@/config/site";
import type { Messages } from "@/i18n/dictionaries/en";
import type { UserRole } from "@/types";

export type NavItem = {
  href: string;
  label: string;
  matchHome?: boolean;
};

export function marketingNav(messages: Messages): NavItem[] {
  return [
    { href: siteConfig.links.forCandidates, label: messages.nav.forJobSeekers },
    { href: siteConfig.links.forEmployers, label: messages.nav.forEmployers },
    { href: siteConfig.links.jobs, label: messages.nav.jobBoard },
    { href: siteConfig.links.whyCrossTalent, label: messages.nav.whyCrossTalent },
  ];
}

export function candidateNav(messages: Messages): NavItem[] {
  return [
    { href: "/candidate/dashboard", label: messages.nav.dashboard },
    { href: "/candidate/profile", label: messages.nav.myProfile },
    { href: "/", label: messages.nav.findJobs, matchHome: true },
    { href: siteConfig.links.candidateMessages, label: messages.nav.messages },
  ];
}

export function employerNav(messages: Messages): NavItem[] {
  return [
    { href: "/employer/dashboard", label: messages.nav.dashboard },
    { href: siteConfig.links.employerJobs, label: messages.nav.jobs },
    { href: "/employer/applications", label: messages.nav.applications },
    { href: siteConfig.links.employerCandidates, label: messages.nav.candidates },
    { href: siteConfig.links.employerMessages, label: messages.nav.messages },
    { href: siteConfig.links.employerCompany, label: messages.nav.company },
    { href: siteConfig.links.employerBilling, label: messages.nav.billing },
  ];
}

export function navForRole(
  messages: Messages,
  role: UserRole | undefined
): NavItem[] {
  if (role === "candidate") return candidateNav(messages);
  if (role === "employer") return employerNav(messages);
  return marketingNav(messages);
}

export function isNavActive(
  pathname: string,
  href: string,
  matchHome?: boolean
): boolean {
  if (matchHome && href === "/") {
    return (
      pathname === "/" ||
      pathname === "/jobs" ||
      pathname.startsWith("/jobs/")
    );
  }
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}
