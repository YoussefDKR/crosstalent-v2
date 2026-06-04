import { siteConfig } from "@/config/site";
import type { UserRole } from "@/types";

export type NavItem = {
  href: string;
  label: string;
  matchHome?: boolean;
};

export const marketingNav: NavItem[] = [
  { href: siteConfig.links.forCandidates, label: "For job seekers" },
  { href: siteConfig.links.forEmployers, label: "For employers" },
  { href: siteConfig.links.jobs, label: "Job board" },
  { href: siteConfig.links.whyCrossTalent, label: "Why CrossTalent" },
];

export const candidateNav: NavItem[] = [
  { href: "/candidate/dashboard", label: "Dashboard" },
  { href: "/candidate/profile", label: "My profile" },
  { href: "/", label: "Find jobs", matchHome: true },
  { href: siteConfig.links.candidateMessages, label: "Messages" },
];

export const employerNav: NavItem[] = [
  { href: "/employer/dashboard", label: "Dashboard" },
  { href: siteConfig.links.employerJobs, label: "Jobs" },
  { href: "/employer/applications", label: "Applications" },
  { href: siteConfig.links.employerCandidates, label: "Candidates" },
  { href: siteConfig.links.employerMessages, label: "Messages" },
  { href: siteConfig.links.employerCompany, label: "Company" },
  { href: siteConfig.links.employerBilling, label: "Billing" },
];

export function navForRole(role: UserRole | undefined): NavItem[] {
  if (role === "candidate") return candidateNav;
  if (role === "employer") return employerNav;
  return marketingNav;
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
