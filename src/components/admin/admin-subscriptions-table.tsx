import { Badge } from "@/components/ui/badge";
import { planDisplayName, statusLabel } from "@/lib/billing/queries";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminSubscriptionRow } from "@/lib/admin/types";
import type { SubscriptionStatus } from "@/types/billing";

type AdminSubscriptionsTableProps = {
  subscriptions: AdminSubscriptionRow[];
};

function statusVariant(
  status: SubscriptionStatus
): "default" | "secondary" | "outline" {
  if (status === "active" || status === "trialing") return "default";
  if (status === "past_due" || status === "unpaid") return "outline";
  return "secondary";
}

export function AdminSubscriptionsTable({
  subscriptions,
}: AdminSubscriptionsTableProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">No subscription records yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Employer billing rows appear when employers sign up or subscribe via
          Stripe.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-[#F8FAFC] text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Employer</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">MRR</th>
              <th className="px-5 py-3 font-medium">Renews</th>
              <th className="px-5 py-3 font-medium">Stripe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscriptions.map((sub) => (
              <tr key={sub.user_id} className="hover:bg-[#F8FAFC]/80">
                <td className="px-5 py-4">
                  <p className="font-medium text-[#0F172A]">
                    {sub.company_name ??
                      sub.employer_name ??
                      "Unnamed employer"}
                  </p>
                  <p className="text-muted-foreground">
                    {sub.employer_email ?? "—"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="outline">{planDisplayName(sub.plan_id)}</Badge>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusVariant(sub.status)}>
                    {statusLabel(sub.status)}
                  </Badge>
                  {sub.cancel_at_period_end && (
                    <p className="mt-1 text-xs text-amber-700">
                      Cancels at period end
                    </p>
                  )}
                </td>
                <td className="px-5 py-4 tabular-nums text-[#0F172A]">
                  {sub.monthly_value > 0
                    ? `€${sub.monthly_value}/mo`
                    : "—"}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {sub.current_period_end
                    ? formatJobPostedAt(sub.current_period_end)
                    : "—"}
                </td>
                <td className="px-5 py-4">
                  {sub.stripe_customer_id ? (
                    <span className="font-mono text-xs text-muted-foreground">
                      {sub.stripe_customer_id.slice(0, 14)}…
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
