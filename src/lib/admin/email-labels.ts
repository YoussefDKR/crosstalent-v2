import type { CandidateEmailType } from "@/lib/candidate/email-campaigns";
import type { EmailLogType } from "@/lib/email/email-log";

export function emailTypeLabel(type: string): string {
  switch (type) {
    case "profile_nudge":
      return "Profile reminder";
    case "job_digest":
      return "Weekly jobs digest";
    case "application_new":
      return "New application (employer)";
    case "application_accepted":
      return "Application accepted";
    case "application_rejected":
      return "Application declined";
    default:
      return type;
  }
}

/** @deprecated Use emailTypeLabel */
export const candidateEmailTypeLabel = emailTypeLabel;

export function isCandidateEmailType(type: string): type is CandidateEmailType {
  return type === "profile_nudge" || type === "job_digest";
}

export function isApplicationEmailType(type: string): type is EmailLogType {
  return (
    type === "application_new" ||
    type === "application_accepted" ||
    type === "application_rejected"
  );
}
