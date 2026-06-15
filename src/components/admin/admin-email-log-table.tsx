import Link from "next/link";
import { emailTypeLabel } from "@/lib/admin/email-labels";
import type { AdminEmailLogRow, AdminEmailLogSummary } from "@/lib/admin/types";
import { formatAppTimezoneLabel, formatDateTimeInAppTz } from "@/lib/datetime";

type AdminEmailLogTableProps = {
  logs: AdminEmailLogRow[];
  summary: AdminEmailLogSummary;
};

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/80 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
        {value}
      </p>
    </div>
  );
}

export function AdminEmailLogTable({ logs, summary }: AdminEmailLogTableProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Send history</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          All automated emails logged when sent. Times use{" "}
          {formatAppTimezoneLabel()}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard label="Total sent" value={summary.total} />
        <SummaryCard label="Profile reminders" value={summary.profileNudges} />
        <SummaryCard label="Job digests" value={summary.jobDigests} />
        <SummaryCard
          label="New application (employer)"
          value={summary.applicationNew}
        />
        <SummaryCard
          label="Application accepted"
          value={summary.applicationAccepted}
        />
        <SummaryCard
          label="Application declined"
          value={summary.applicationRejected}
        />
      </div>

      {summary.lastSentAt && (
        <p className="text-xs text-muted-foreground">
          Last send: {formatDateTimeInAppTz(summary.lastSentAt)}
        </p>
      )}

      {logs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-slate-50/80 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Sent</th>
                  <th className="px-4 py-3 font-medium">Recipient</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDateTimeInAppTz(row.sent_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${row.user_id}`}
                        className="font-medium text-[#2563EB] hover:underline"
                      >
                        {row.recipient_name ?? "User"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.recipient_email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-[#0F172A]">
                        {emailTypeLabel(row.email_type)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length >= 100 && (
            <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
              Showing the 100 most recent sends.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-slate-50/50 px-6 py-12 text-center text-sm text-muted-foreground">
          No emails logged yet. Sends appear here after the Monday cron runs,
          when candidates apply, or when employers accept or decline
          applications.
        </div>
      )}
    </section>
  );
}
