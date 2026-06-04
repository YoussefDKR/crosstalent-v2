export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type LanguageProficiency =
  | "basic"
  | "conversational"
  | "professional"
  | "native";

export type CandidateProfileRow = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  country_code: string | null;
  phone: string | null;
  cv_path: string | null;
  cv_file_name: string | null;
  cv_uploaded_at: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateSkill = {
  id: string;
  name: string;
  level: SkillLevel | null;
};

export type CandidateLanguage = {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
};

export type CandidateExperience = {
  id: string;
  company: string;
  title: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  sortOrder: number;
};

export type CandidateProfileData = {
  profile: {
    id: string;
    fullName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  details: CandidateProfileRow | null;
  skills: CandidateSkill[];
  languages: CandidateLanguage[];
  experiences: CandidateExperience[];
};

export type ProfileCompletion = {
  percent: number;
  completed: number;
  total: number;
  items: {
    key: string;
    label: string;
    done: boolean;
    weight: number;
  }[];
};
