import Link from "next/link";
import { candidateEmailTypeLabel } from "@/lib/admin/email-labels";
import type { AdminEmailLogRow, AdminEmailLogSummary } from "@/lib/admin/types";
import { formatAppTimezoneLabel, formatDateTimeInAppTz } from "@/lib/datetime";

type AdminEmailLogTableProps = {
  logs: AdminEmailLogRow[];
  summary: AdminEmailLogSummary;
};

export function AdminEmailLogTable({ logs, summary }: AdminEmailLogTableProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">Send history</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Automated candidate emails logged when sent. Times use{" "}
          {formatAppTimezoneLabel()}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">Total sent</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
            {summary.total}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">Profile reminders</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
            {summary.profileNudges}
          </p>
        </div>
        <div className="rounded-xl border border-border/80 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-muted-foreground">Job digests</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0F172A]">
            {summary.jobDigests}
          </p>
        </div>
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
                        {row.recipient_name ?? "Candidate"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.recipient_email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-[#0F172A]">
                        {candidateEmailTypeLabel(row.email_type)}
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
          No emails logged yet. Sends appear here after the Monday cron runs or
          when you trigger{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs">
            /api/cron/candidate-emails
          </code>
          .
        </div>
      )}
    </section>
  );
}
