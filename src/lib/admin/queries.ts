import { EMPLOYER_PLANS, STARTER_PLAN } from "@/config/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { isStripeConfigured } from "@/lib/stripe/config";
import type {
  AdminApplicationRow,
  AdminJobRow,
  AdminRevenueStats,
  AdminStats,
  AdminSubscriptionRow,
  AdminUserRow,
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
    .select("id, full_name, email, role, created_at, avatar_url")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as AdminUserRow[];
}
