import { JOB_LOCATION_COUNTRIES } from "@/config/jobs";
import { APP_TIMEZONE } from "@/lib/datetime";
import type { JobRow } from "@/types/jobs";

const countryByCode = new Map(
  JOB_LOCATION_COUNTRIES.map((c) => [c.code, c.label])
);

export function countryLabelFromCode(code: string | null | undefined): string {
  if (!code) return "";
  return (countryByCode as Map<string, string>).get(code) ?? code;
}

/** Simple flag emoji from ISO-style codes used in config */
export function countryFlagEmoji(code: string | null | undefined): string {
  if (!code || code === "REMOTE") return "🌍";
  if (code === "UK") return "🇬🇧";
  if (code.length !== 2) return "";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...[...upper].map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

export function formatJobPostedAt(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    dateStyle: "medium",
    timeZone: APP_TIMEZONE,
  });
}

export function companyInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

const logoHues = [
  "bg-amber-400",
  "bg-rose-400",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-orange-400",
];

export function companyLogoColorClass(name: string | null | undefined): string {
  const s = name ?? "?";
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return logoHues[Math.abs(hash) % logoHues.length];
}

export function formatSalaryRange(job: JobRow): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency ?? "EUR";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  if (job.salary_min && job.salary_max) {
    return `${fmt(job.salary_min)} – ${fmt(job.salary_max)}`;
  }
  if (job.salary_min) return `From ${fmt(job.salary_min)}`;
  return `Up to ${fmt(job.salary_max!)}`;
}
