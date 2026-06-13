import { EMPLOYER_PLANS, STARTER_PLAN } from "@/config/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeConfigured } from "@/lib/stripe/config";
import { countryDisplayName } from "@/lib/geo/request-country";
import type {
  AdminAnalyticsDashboard,
  AdminApplicationRow,
  AdminJobRow,
  AdminRevenueStats,
  AdminSignupCountryStats,
  AdminStats,
  AdminSubscriptionRow,
  AdminUserProfile,
  AdminUserRow,
  AdminVisitStats,
} from "@/lib/admin/types";
import type { SubscriptionStatus } from "@/types/billing";
import type { UserRole } from "@/types";

function planMonthlyValue(planId: string): number {
  if (planId === STARTER_PLAN.id) return 0;
  const plan = EMPLOYER_PLANS.find((p) => p.id === planId);
  return plan?.monthlyPrice ?? 0;
}

function countsTowardMrr(status: SubscriptionStatus): boolean {
  return status === "active" || status === "trialing";
}

function startOfTodayUtc(): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgoUtc(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createAdminClient();
  const today = startOfTodayUtc();
  const weekAgo = daysAgoUtc(7);

  const [
    { count: signupsToday },
    { count: signupsThisWeek },
    { count: totalUsers },
    { count: totalCandidates },
    { count: totalEmployers },
    { count: totalAdmins },
    { count: jobsPublished },
    { count: jobsDraft },
    { count: jobsClosed },
    { count: jobsRss },
    { count: jobsPlatform },
    { count: applicationsToday },
    { count: totalApplications },
    { count: pendingApplications },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "candidate"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "employer"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "closed"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("source_type", "rss"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("source_type", "platform"),
    supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today),
    supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    signupsToday: signupsToday ?? 0,
    signupsThisWeek: signupsThisWeek ?? 0,
    totalUsers: totalUsers ?? 0,
    totalCandidates: totalCandidates ?? 0,
    totalEmployers: totalEmployers ?? 0,
    totalAdmins: totalAdmins ?? 0,
    jobsPublished: jobsPublished ?? 0,
    jobsDraft: jobsDraft ?? 0,
    jobsClosed: jobsClosed ?? 0,
    jobsRss: jobsRss ?? 0,
    jobsPlatform: jobsPlatform ?? 0,
    applicationsToday: applicationsToday ?? 0,
    totalApplications: totalApplications ?? 0,
    pendingApplications: pendingApplications ?? 0,
    ...(await getAdminRevenueSummary()),
  };
}

async function getAdminRevenueSummary(): Promise<{
  activeSubscriptions: number;
  estimatedMrr: number;
}> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("employer_subscriptions")
    .select("plan_id, status");

  let activeSubscriptions = 0;
  let estimatedMrr = 0;

  for (const row of data ?? []) {
    const status = row.status as SubscriptionStatus;
    if (!countsTowardMrr(status)) continue;
    activeSubscriptions += 1;
    estimatedMrr += planMonthlyValue(row.plan_id);
  }

  return { activeSubscriptions, estimatedMrr };
}

export async function getAdminRevenueStats(): Promise<AdminRevenueStats> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("employer_subscriptions")
    .select("plan_id, status");

  const stats: AdminRevenueStats = {
    activeSubscriptions: 0,
    trialingSubscriptions: 0,
    inactiveSubscriptions: 0,
    pastDueSubscriptions: 0,
    canceledSubscriptions: 0,
    unpaidSubscriptions: 0,
    growthSubscribers: 0,
    scaleSubscribers: 0,
    starterAccounts: 0,
    estimatedMrr: 0,
    stripeConfigured: isStripeConfigured(),
  };

  for (const row of data ?? []) {
    const status = row.status as SubscriptionStatus;
    if (status === "active") stats.activeSubscriptions += 1;
    else if (status === "trialing") stats.trialingSubscriptions += 1;
    else if (status === "inactive") stats.inactiveSubscriptions += 1;
    else if (status === "past_due") stats.pastDueSubscriptions += 1;
    else if (status === "canceled") stats.canceledSubscriptions += 1;
    else if (status === "unpaid") stats.unpaidSubscriptions += 1;

    if (row.plan_id === "growth") stats.growthSubscribers += 1;
    else if (row.plan_id === "scale") stats.scaleSubscribers += 1;
    else stats.starterAccounts += 1;

    if (countsTowardMrr(status)) {
      stats.estimatedMrr += planMonthlyValue(row.plan_id);
    }
  }

  return stats;
}

export async function listAdminSubscriptions(): Promise<AdminSubscriptionRow[]> {
  const supabase = createAdminClient();

  const [{ data: employers, error: employerError }, { data: subs, error }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .eq("role", "employer")
        .order("created_at", { ascending: false }),
      supabase.from("employer_subscriptions").select("*"),
    ]);

  if (employerError) throw new Error(employerError.message);
  if (error) throw new Error(error.message);
  if (!employers?.length) return [];

  const userIds = employers.map((e) => e.id);
  const { data: companies } = await supabase
    .from("company_profiles")
    .select("user_id, company_name")
    .in("user_id", userIds);

  const subByUser = new Map((subs ?? []).map((s) => [s.user_id, s]));
  const companyByUser = new Map(
    (companies ?? []).map((c) => [c.user_id, c.company_name as string | null])
  );

  return employers.map((employer) => {
    const sub = subByUser.get(employer.id);
    const status = (sub?.status ?? "inactive") as SubscriptionStatus;
    const planId = sub?.plan_id ?? STARTER_PLAN.id;

    return {
      user_id: employer.id,
      employer_name: employer.full_name,
      employer_email: employer.email,
      company_name: companyByUser.get(employer.id) ?? null,
      plan_id: planId,
      status,
      stripe_customer_id: sub?.stripe_customer_id ?? null,
      stripe_subscription_id: sub?.stripe_subscription_id ?? null,
      current_period_end: sub?.current_period_end ?? null,
      cancel_at_period_end: sub?.cancel_at_period_end ?? false,
      monthly_value: countsTowardMrr(status) ? planMonthlyValue(planId) : 0,
      created_at: sub?.created_at ?? employer.created_at,
    };
  });
}

export async function listAdminUsers(options?: {
  role?: UserRole | "all";
  q?: string;
}): Promise<AdminUserRow[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, avatar_url")
    .order("created_at", { ascending: false })
    .limit(200);

  if (options?.role && options.role !== "all") {
    query = query.eq("role", options.role);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let rows = (data ?? []) as AdminUserRow[];
  const q = options?.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter(
      (row) =>
        row.email?.toLowerCase().includes(q) ||
        row.full_name?.toLowerCase().includes(q)
    );
  }

  return rows;
}

export async function listAdminJobs(options?: {
  status?: string;
  source?: string;
}): Promise<AdminJobRow[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("jobs")
    .select(
      "id, title, status, source_type, employer_id, rss_company_name, external_source, location_city, location_country, created_at, published_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }
  if (options?.source && options.source !== "all") {
    query = query.eq("source_type", options.source);
  }

  const { data: jobs, error } = await query;
  if (error) throw new Error(error.message);
  if (!jobs?.length) return [];

  const employerIds = [
    ...new Set(
      jobs.map((j) => j.employer_id).filter((id): id is string => Boolean(id))
    ),
  ];

  const { data: employers } =
    employerIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", employerIds)
      : { data: [] };

  const { data: companies } =
    employerIds.length > 0
      ? await supabase
          .from("company_profiles")
          .select("user_id, company_name")
          .in("user_id", employerIds)
      : { data: [] };

  const profileById = new Map(
    (employers ?? []).map((p) => [p.id, p as { full_name: string | null; email: string | null }])
  );
  const companyByUser = new Map(
    (companies ?? []).map((c) => [c.user_id, c.company_name as string | null])
  );

  return jobs.map((job) => {
    const employer = job.employer_id ? profileById.get(job.employer_id) : null;
    const companyName = job.employer_id
      ? companyByUser.get(job.employer_id)
      : null;
    return {
      ...job,
      source_type: job.source_type as "platform" | "rss",
      status: job.status as AdminJobRow["status"],
      employer_name: companyName ?? employer?.full_name ?? null,
      employer_email: employer?.email ?? null,
    };
  });
}

export async function listAdminApplications(): Promise<AdminApplicationRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("job_applications")
    .select("id, status, created_at, job_id, candidate_id")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  if (!data?.length) return [];

  const jobIds = [...new Set(data.map((a) => a.job_id))];
  const candidateIds = [...new Set(data.map((a) => a.candidate_id))];

  const [{ data: jobs }, { data: candidates }] = await Promise.all([
    supabase.from("jobs").select("id, title").in("id", jobIds),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", candidateIds),
  ]);

  const jobTitle = new Map((jobs ?? []).map((j) => [j.id, j.title as string]));
  const candidateById = new Map(
    (candidates ?? []).map((c) => [
      c.id,
      c as { full_name: string | null; email: string | null },
    ])
  );

  return data.map((row) => {
    const candidate = candidateById.get(row.candidate_id);
    return {
      id: row.id,
      status: row.status as AdminApplicationRow["status"],
      created_at: row.created_at,
      job_id: row.job_id,
      job_title: jobTitle.get(row.job_id) ?? "Unknown job",
      candidate_id: row.candidate_id,
      candidate_name: candidate?.full_name ?? null,
      candidate_email: candidate?.email ?? null,
    };
  });
}

export async function listRecentSignups(limit = 8): Promise<AdminUserRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, avatar_url, signup_country")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminUserRow[];
}

function resolveProfileCountry(
  signupCountry: string | null | undefined,
  candidateCountry: string | null | undefined,
  employerCountry: string | null | undefined
): string {
  return (
    signupCountry?.trim().toUpperCase() ||
    candidateCountry?.trim().toUpperCase() ||
    employerCountry?.trim().toUpperCase() ||
    "UNKNOWN"
  );
}

export async function getSignupCountryStats(): Promise<AdminSignupCountryStats> {
  const supabase = createAdminClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, signup_country")
    .neq("role", "admin");

  if (error) throw new Error(error.message);

  const rows = profiles ?? [];
  if (rows.length === 0) {
    return {
      totalUsers: 0,
      trackedUsers: 0,
      unknownUsers: 0,
      countries: [],
    };
  }

  const userIds = rows.map((row) => row.id);
  const [{ data: candidates }, { data: companies }] = await Promise.all([
    supabase
      .from("candidate_profiles")
      .select("user_id, country_code")
      .in("user_id", userIds),
    supabase
      .from("company_profiles")
      .select("user_id, headquarters_country")
      .in("user_id", userIds),
  ]);

  const candidateByUser = new Map(
    (candidates ?? []).map((row) => [row.user_id, row.country_code])
  );
  const companyByUser = new Map(
    (companies ?? []).map((row) => [row.user_id, row.headquarters_country])
  );

  const counts = new Map<string, number>();
  let trackedUsers = 0;

  for (const profile of rows) {
    if (profile.signup_country) trackedUsers += 1;
    const country = resolveProfileCountry(
      profile.signup_country,
      candidateByUser.get(profile.id),
      companyByUser.get(profile.id)
    );
    counts.set(country, (counts.get(country) ?? 0) + 1);
  }

  const totalUsers = rows.length;
  const unknownUsers = counts.get("UNKNOWN") ?? 0;
  const countries = [...counts.entries()]
    .filter(([code]) => code !== "UNKNOWN")
    .map(([countryCode, count]) => ({
      countryCode,
      countryName: countryDisplayName(countryCode),
      count,
      share: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalUsers,
    trackedUsers,
    unknownUsers,
    countries,
  };
}

const DEFAULT_TREND_DAYS = 90;
const MAX_TREND_DAYS = 90;

export function resolveTrendDays(value: string | undefined): number {
  const parsed = Number(value);
  if (parsed === 7 || parsed === 30 || parsed === 90) return parsed;
  return DEFAULT_TREND_DAYS;
}

function aggregateTopPages(
  rows: { path: string | null }[],
  total: number
): AdminVisitStats["topPages"] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const path = row.path?.trim() || "/";
    counts.set(path, (counts.get(path) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([path, count]) => ({
      path,
      count,
      share: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

export async function getVisitStats(
  trendDays = DEFAULT_TREND_DAYS
): Promise<AdminVisitStats> {
  const supabase = createAdminClient();
  const today = startOfTodayUtc();
  const weekAgo = daysAgoUtc(7);
  const trendStart = daysAgoUtc(trendDays);

  const { data, error } = await supabase
    .from("site_visits")
    .select("visitor_id, country_code, path, created_at")
    .gte("created_at", trendStart);

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const uniqueVisitors = new Set(rows.map((row) => row.visitor_id)).size;
  const visitsToday = rows.filter((row) => row.created_at >= today).length;
  const visitsThisWeek = rows.filter((row) => row.created_at >= weekAgo).length;

  const { count: totalVisits } = await supabase
    .from("site_visits")
    .select("*", { count: "exact", head: true });

  return {
    totalVisits: totalVisits ?? rows.length,
    uniqueVisitors,
    visitsToday,
    visitsThisWeek,
    countries: aggregateVisitCountries(rows, rows.length),
    topPages: aggregateTopPages(rows, rows.length),
  };
}

export async function getAdminAnalyticsDashboard(
  trendDaysInput?: number
): Promise<AdminAnalyticsDashboard> {
  const trendDays = Math.min(
    Math.max(trendDaysInput ?? DEFAULT_TREND_DAYS, 7),
    MAX_TREND_DAYS
  );
  const supabase = createAdminClient();
  const trendStart = daysAgoUtc(trendDays);
  const dayKeys = lastNDays(trendDays);

  const [visits, signups, { data: visitRows }, { data: signupRows }] =
    await Promise.all([
      getVisitStats(trendDays),
      getSignupCountryStats(),
      supabase
        .from("site_visits")
        .select("visitor_id, created_at")
        .gte("created_at", trendStart),
      supabase
        .from("profiles")
        .select("created_at")
        .neq("role", "admin")
        .gte("created_at", trendStart),
    ]);

  const visitsByDay = new Map<string, number>();
  const uniquesByDay = new Map<string, Set<string>>();
  const signupsByDay = new Map<string, number>();

  for (const day of dayKeys) {
    visitsByDay.set(day, 0);
    uniquesByDay.set(day, new Set());
    signupsByDay.set(day, 0);
  }

  for (const row of visitRows ?? []) {
    const day = row.created_at.slice(0, 10);
    if (!visitsByDay.has(day)) continue;
    visitsByDay.set(day, (visitsByDay.get(day) ?? 0) + 1);
    uniquesByDay.get(day)?.add(row.visitor_id);
  }

  for (const row of signupRows ?? []) {
    const day = row.created_at.slice(0, 10);
    if (!signupsByDay.has(day)) continue;
    signupsByDay.set(day, (signupsByDay.get(day) ?? 0) + 1);
  }

  const trends = dayKeys.map((date) => ({
    date,
    label: formatTrendLabel(date),
    visits: visitsByDay.get(date) ?? 0,
    uniqueVisitors: uniquesByDay.get(date)?.size ?? 0,
    signups: signupsByDay.get(date) ?? 0,
  }));

  return { visits, signups, trends, trendDays };
}

function lastNDays(days: number): string[] {
  const result: string[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - offset);
    result.push(date.toISOString().slice(0, 10));
  }
  return result;
}

function formatTrendLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function aggregateVisitCountries(
  rows: { country_code: string | null }[],
  total: number
): AdminVisitStats["countries"] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const code = row.country_code?.trim().toUpperCase() || "UNKNOWN";
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  return [...counts.entries()]
    .filter(([code]) => code !== "UNKNOWN")
    .map(([countryCode, count]) => ({
      countryCode,
      countryName: countryDisplayName(countryCode),
      count,
      share: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function getAdminUserProfile(
  userId: string
): Promise<AdminUserProfile | null> {
  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, avatar_url, signup_country")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!profile) return null;

  const base: AdminUserProfile = {
    profile: profile as AdminUserRow,
    candidate: null,
    company: null,
  };

  if (profile.role === "candidate") {
    const [detailsRes, skillsRes, languagesRes, experiencesRes] =
      await Promise.all([
        supabase
          .from("candidate_profiles")
          .select(
            "headline, bio, location, country_code, phone, linkedin_url, portfolio_url, cv_file_name"
          )
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("candidate_skills")
          .select("name, level")
          .eq("user_id", userId)
          .order("created_at"),
        supabase
          .from("candidate_languages")
          .select("language, proficiency")
          .eq("user_id", userId)
          .order("created_at"),
        supabase
          .from("candidate_experiences")
          .select(
            "title, company, location, start_date, end_date, is_current"
          )
          .eq("user_id", userId)
          .order("sort_order"),
      ]);

    base.candidate = {
      headline: detailsRes.data?.headline ?? null,
      bio: detailsRes.data?.bio ?? null,
      location: detailsRes.data?.location ?? null,
      country_code: detailsRes.data?.country_code ?? null,
      phone: detailsRes.data?.phone ?? null,
      linkedin_url: detailsRes.data?.linkedin_url ?? null,
      portfolio_url: detailsRes.data?.portfolio_url ?? null,
      cv_file_name: detailsRes.data?.cv_file_name ?? null,
      skills: (skillsRes.data ?? []).map((s) => ({
        name: s.name,
        level: s.level,
      })),
      languages: (languagesRes.data ?? []).map((l) => ({
        name: l.language,
        proficiency: l.proficiency,
      })),
      experiences: experiencesRes.data ?? [],
    };
  }

  if (profile.role === "employer") {
    const { data: company } = await supabase
      .from("company_profiles")
      .select(
        "company_name, tagline, description, website, logo_url, industry, company_size, headquarters_city, headquarters_country, hiring_in_regions, linkedin_url, contact_email, contact_phone"
      )
      .eq("user_id", userId)
      .maybeSingle();

    base.company = company ?? null;
  }

  return base;
}
