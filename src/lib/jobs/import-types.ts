import type { EmploymentType } from "@/types/jobs";

export type ParsedImportedJob = {
  external_guid: string;
  external_url: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  location_country: string | null;
  location_city: string | null;
  published_at: string | null;
  employment_type: EmploymentType;
};
