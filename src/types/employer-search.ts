import type { CandidateExperience, CandidateLanguage, CandidateSkill } from "@/types/candidate";

export type CandidateSearchFilters = {
  q?: string;
  country?: string;
  skill?: string;
  language?: string;
  hasCv?: boolean;
};

export type CandidateListItem = {
  id: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  countryCode: string | null;
  hasCv: boolean;
  skills: CandidateSkill[];
  languages: CandidateLanguage[];
  completionPercent: number;
};

export type CandidateDetailForEmployer = {
  id: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  countryCode: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  cvFileName: string | null;
  cvSignedUrl: string | null;
  skills: CandidateSkill[];
  languages: CandidateLanguage[];
  experiences: CandidateExperience[];
  completionPercent: number;
};
