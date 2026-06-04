export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export type CompanyProfileRow = {
  user_id: string;
  company_name: string | null;
  tagline: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  industry: string | null;
  company_size: CompanySize | null;
  headquarters_city: string | null;
  headquarters_country: string | null;
  hiring_in_regions: string | null;
  linkedin_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CompanyProfileData = {
  profile: {
    id: string;
    fullName: string | null;
    email: string | null;
    avatarUrl: string | null;
  };
  company: CompanyProfileRow | null;
};

export type CompanyCompletion = {
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
