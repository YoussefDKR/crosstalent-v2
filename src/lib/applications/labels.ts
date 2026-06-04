import type { ApplicationStatus } from "@/types/applications";

export function applicationStatusLabel(status: ApplicationStatus): string {
  const map: Record<ApplicationStatus, string> = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Declined",
  };
  return map[status];
}
