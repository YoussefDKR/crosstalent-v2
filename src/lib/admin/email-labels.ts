import type { CandidateEmailType } from "@/lib/candidate/email-campaigns";

export function candidateEmailTypeLabel(type: string): string {
  switch (type) {
    case "profile_nudge":
      return "Profile reminder";
    case "job_digest":
      return "Weekly jobs digest";
    default:
      return type;
  }
}

export function isCandidateEmailType(type: string): type is CandidateEmailType {
  return type === "profile_nudge" || type === "job_digest";
}
