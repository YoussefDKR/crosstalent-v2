"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { AdminAnalyticsDashboard } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import {
  AdminAnalyticsCharts,
  AdminDailyVisitsTable,
  AdminTopPagesTable,
} from "@/components/admin/admin-analytics-charts";

const PERIOD_OPTIONS = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
] as const;

type AdminAnalyticsSectionProps = {
  data: AdminAnalyticsDashboard;
};

export function AdminAnalyticsSection({ data }: AdminAnalyticsSectionProps) {
  const searchParams = useSearchParams();
  const activeDays = data.trendDays;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#0F172A]">Traffic & growth</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily visits, top pages, and signups.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("days", String(option.days));
            return (
              <Link
                key={option.days}
                href={`/admin/dashboard?${params.toString()}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  activeDays === option.days
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : "border-border bg-white text-muted-foreground hover:border-[#2563EB]/40"
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      <AdminAnalyticsCharts data={data} />
      <div className="grid gap-6 xl:grid-cols-2">
        <AdminDailyVisitsTable trends={data.trends} />
        <AdminTopPagesTable pages={data.visits.topPages} days={data.trendDays} />
      </div>
    </div>
  );
}
