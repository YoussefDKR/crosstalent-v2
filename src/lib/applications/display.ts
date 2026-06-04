import type { ApplicationStatus } from "@/types/applications";

export function applicationDisplayStatus(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    pending: "New",
    accepted: "Shortlisted",
    rejected: "Declined",
  };
  return map[status];
}

export function applicationStatusBadgeClass(
  status: ApplicationStatus
): string {
  const map: Record<ApplicationStatus, string> = {
    pending: "bg-violet-100 text-violet-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-slate-100 text-slate-600",
  };
  return map[status];
}

const LANGUAGE_TAG_COLORS: Record<string, string> = {
  French: "bg-blue-100 text-blue-800",
  English: "bg-emerald-100 text-emerald-800",
  Arabic: "bg-amber-100 text-amber-800",
  Spanish: "bg-orange-100 text-orange-800",
  German: "bg-indigo-100 text-indigo-800",
  Italian: "bg-rose-100 text-rose-800",
};

export function languageTagClass(language: string): string {
  return (
    LANGUAGE_TAG_COLORS[language] ?? "bg-slate-100 text-slate-700"
  );
}
