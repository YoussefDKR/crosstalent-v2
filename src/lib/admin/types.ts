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
  signup_country: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
};

export type AdminUserSubscription = {
  plan_id: string;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_end: string | null;
};

export type AdminCountrySignupStat = {
  countryCode: string;
  countryName: string;
  count: number;
  share: number;
};

export type AdminSignupCountryStats = {
  totalUsers: number;
  trackedUsers: number;
  unknownUsers: number;
  countries: AdminCountrySignupStat[];
};

export type AdminCountryVisitStat = {
  countryCode: string;
  countryName: string;
  count: number;
  share: number;
};

export type AdminPageVisitStat = {
  path: string;
  count: number;
  share: number;
};

export type AdminVisitStats = {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  visitsThisWeek: number;
  countries: AdminCountryVisitStat[];
  topPages: AdminPageVisitStat[];
};

export type AdminDailyTrendPoint = {
  date: string;
  label: string;
  visits: number;
  uniqueVisitors: number;
  signups: number;
};

export type AdminAnalyticsDashboard = {
  visits: AdminVisitStats;
  signups: AdminSignupCountryStats;
  trends: AdminDailyTrendPoint[];
  trendDays: number;
};

export type AdminUserProfile = {
  profile: AdminUserRow;
  subscription: AdminUserSubscription | null;
  candidate: {
    headline: string | null;
    bio: string | null;
    location: string | null;
    country_code: string | null;
    phone: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    cv_file_name: string | null;
    skills: { name: string; level: string | null }[];
    languages: { name: string; proficiency: string | null }[];
    experiences: {
      title: string;
      company: string;
      location: string | null;
      start_date: string;
      end_date: string | null;
      is_current: boolean;
    }[];
  } | null;
  company: {
    company_name: string | null;
    tagline: string | null;
    description: string | null;
    website: string | null;
    logo_url: string | null;
    industry: string | null;
    company_size: string | null;
    headquarters_city: string | null;
    headquarters_country: string | null;
    hiring_in_regions: string | null;
    linkedin_url: string | null;
    contact_email: string | null;
    contact_phone: string | null;
  } | null;
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
  external_url: string | null;
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
