"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminAnalyticsDashboard } from "@/lib/admin/types";

type AdminAnalyticsChartsProps = {
  data: AdminAnalyticsDashboard;
};

const CHART_COLORS = {
  visits: "#2563EB",
  unique: "#60A5FA",
  signups: "#10B981",
  visitsBar: "#3B82F6",
  signupsBar: "#059669",
};

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[#0F172A]">
        {value.toLocaleString("en-EU")}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-[#0F172A]">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="px-3 py-5 sm:px-5">{children}</div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function AdminAnalyticsCharts({ data }: AdminAnalyticsChartsProps) {
  const { visits, signups, trends } = data;
  const hasTrendData = trends.some(
    (point) => point.visits > 0 || point.signups > 0
  );
  const topVisitCountries = visits.countries.slice(0, 8);
  const topSignupCountries = signups.countries.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[#0F172A]">Traffic & growth</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Website visits and signups over the last 30 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total visits"
          value={visits.totalVisits}
          hint="All recorded sessions"
        />
        <MetricCard
          label="Unique visitors"
          value={visits.uniqueVisitors}
          hint="Last 30 days"
        />
        <MetricCard
          label="Visits today"
          value={visits.visitsToday}
          hint={`${visits.visitsThisWeek.toLocaleString("en-EU")} this week`}
        />
        <MetricCard
          label="Total signups"
          value={signups.totalUsers}
          hint={`${signups.trackedUsers.toLocaleString("en-EU")} with country`}
        />
      </div>

      <ChartCard
        title="Visits & signups over time"
        description="Daily trend for the last 30 days"
      >
        {hasTrendData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trends} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.visits} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.visits} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.signups} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.signups} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="visits"
                name="Visits"
                stroke={CHART_COLORS.visits}
                fill="url(#visitsGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                name="Unique visitors"
                stroke={CHART_COLORS.unique}
                fill="none"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="signups"
                name="Signups"
                stroke={CHART_COLORS.signups}
                fill="url(#signupsGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="Visit and signup data will appear here as traffic comes in." />
        )}
      </ChartCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Visits by country"
          description="Where visitors are browsing from (last 30 days)"
        >
          {topVisitCountries.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(280, topVisitCountries.length * 42)}>
              <BarChart
                data={topVisitCountries}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="countryName"
                  width={110}
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString("en-EU"), "Visits"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Visits"
                  fill={CHART_COLORS.visitsBar}
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Country data will appear after visitors browse the site." />
          )}
        </ChartCard>

        <ChartCard
          title="Signups by country"
          description="Where new users registered from"
        >
          {topSignupCountries.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={Math.max(280, topSignupCountries.length * 42)}
            >
              <BarChart
                data={topSignupCountries}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="countryName"
                  width={110}
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [Number(value).toLocaleString("en-EU"), "Signups"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Signups"
                  fill={CHART_COLORS.signupsBar}
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="Signup country data will appear as users join." />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
