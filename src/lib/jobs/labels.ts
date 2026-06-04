import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  REMOTE_TYPES,
} from "@/config/jobs";
import type {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  RemoteType,
} from "@/types/jobs";

export function employmentLabel(value: EmploymentType): string {
  return EMPLOYMENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function remoteLabel(value: RemoteType): string {
  return REMOTE_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function experienceLabel(value: ExperienceLevel): string {
  return EXPERIENCE_LEVELS.find((l) => l.value === value)?.label ?? value;
}

export function statusLabel(value: JobStatus): string {
  const map: Record<JobStatus, string> = {
    draft: "Draft",
    published: "Published",
    closed: "Closed",
  };
  return map[value] ?? value;
}

export function locationLabel(
  city: string | null,
  country: string | null
): string {
  if (city && country) return `${city}, ${country}`;
  return city ?? country ?? "Location flexible";
}
