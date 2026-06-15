import type { CandidateProfileData } from "@/types/candidate";

export type ApplyBlockerKey = "headline" | "country" | "cv";

export function getApplyBlockers(data: CandidateProfileData): ApplyBlockerKey[] {
  const blockers: ApplyBlockerKey[] = [];
  const details = data.details;

  if (!details?.headline?.trim()) blockers.push("headline");
  if (!details?.country_code?.trim()) blockers.push("country");
  if (!details?.cv_path?.trim()) blockers.push("cv");

  return blockers;
}

export function canApplyToJobs(data: CandidateProfileData): boolean {
  return getApplyBlockers(data).length === 0;
}
