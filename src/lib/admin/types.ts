import type { SubscriptionStatus } from "@/types/billing";
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
  activeSubscriptions: number;
  estimatedMrr: number;
};

export type AdminRevenueStats = {
  activeSubscriptions: number;
  trialingSubscriptions: number;
  inactiveSubscriptions: number;
  pastDueSubscriptions: number;
  canceledSubscriptions: number;
  unpaidSubscriptions: number;
  growthSubscribers: number;
  scaleSubscribers: number;
  starterAccounts: number;
  estimatedMrr: number;
  stripeConfigured: boolean;
};

export type AdminSubscriptionRow = {
  user_id: string;
  employer_name: string | null;
  employer_email: string | null;
  company_name: string | null;
  plan_id: string;
  status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  monthly_value: number;
  created_at: string;
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
