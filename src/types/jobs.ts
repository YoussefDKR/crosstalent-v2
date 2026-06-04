export type JobStatus = "draft" | "published" | "closed";
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";
export type RemoteType = "onsite" | "hybrid" | "remote";
export type ExperienceLevel = "junior" | "mid" | "senior" | "lead";

export type JobRow = {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements: string | null;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  remote_type: RemoteType;
  location_city: string | null;
  location_country: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  skills: string[];
  languages: string[];
  status: JobStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type JobWithCompany = JobRow & {
  company_name: string | null;
  company_logo_url: string | null;
  headquarters_country: string | null;
};

export type JobFilters = {
  q?: string;
  country?: string;
  employmentType?: EmploymentType;
  remoteType?: RemoteType;
  experienceLevel?: ExperienceLevel;
  skill?: string;
  salaryMin?: number;
};
