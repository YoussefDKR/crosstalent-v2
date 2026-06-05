import type { AdminRevenueStats } from "@/lib/admin/types";

type AdminRevenueStatsProps = {
  stats: AdminRevenueStats;
};

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-[#0F172A]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AdminRevenueStatsPanel({ stats }: AdminRevenueStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Estimated MRR"
          value={`€${stats.estimatedMrr.toLocaleString("en-EU")}`}
          hint="Active + trialing at list price"
        />
        <Metric
          label="Active"
          value={stats.activeSubscriptions}
          hint={`${stats.trialingSubscriptions} on trial`}
        />
        <Metric
          label="Growth plan"
          value={stats.growthSubscribers}
          hint="€199/mo list price"
        />
        <Metric
          label="Scale plan"
          value={stats.scaleSubscribers}
          hint="€499/mo list price"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Starter (free)" value={stats.starterAccounts} />
        <Metric label="Past due" value={stats.pastDueSubscriptions} />
        <Metric label="Canceled" value={stats.canceledSubscriptions} />
        <Metric label="Inactive" value={stats.inactiveSubscriptions} />
      </div>

      {!stats.stripeConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Stripe is not configured in production env vars yet. Figures below
          reflect database records only — connect Stripe for live checkout and
          webhooks.
        </div>
      )}
    </div>
  );
}
