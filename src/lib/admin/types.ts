import type { JobStatus } from "@/types/jobs";
import type { UserRole } from "@/types";

export type AdminStats = {
  signupsToday: number;
  signupsThisWeek: number;
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalAdmins: number;
  jobsPublished: number;
  jobsDraft: number;
  jobsClosed: number;
  jobsRss: number;
  jobsPlatform: number;
  applicationsToday: number;
  totalApplications: number;
  pendingApplications: number;
};

export type AdminUserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  created_at: string;
  avatar_url: string | null;
};

export type AdminJobRow = {
  id: string;
  title: string;
  status: JobStatus;
  source_type: "platform" | "rss";
  employer_id: string | null;
  employer_name: string | null;
  employer_email: string | null;
  rss_company_name: string | null;
  external_source: string | null;
  location_city: string | null;
  location_country: string | null;
  created_at: string;
  published_at: string | null;
};

export type AdminApplicationRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  job_id: string;
  job_title: string;
  candidate_id: string;
  candidate_name: string | null;
  candidate_email: string | null;
};
