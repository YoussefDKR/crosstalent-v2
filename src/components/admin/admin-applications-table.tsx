import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminApplicationRow } from "@/lib/admin/types";

type AdminApplicationsTableProps = {
  applications: AdminApplicationRow[];
};

function statusVariant(
  status: AdminApplicationRow["status"]
): "default" | "secondary" | "outline" {
  if (status === "accepted") return "default";
  if (status === "rejected") return "outline";
  return "secondary";
}

export function AdminApplicationsTable({
  applications,
}: AdminApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">No applications yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-[#F8FAFC] text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Candidate</th>
              <th className="px-5 py-3 font-medium">Job</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-[#F8FAFC]/80">
                <td className="px-5 py-4">
                  <p className="font-medium text-[#0F172A]">
                    {app.candidate_name ?? "Unnamed"}
                  </p>
                  <p className="text-muted-foreground">
                    {app.candidate_email ?? "—"}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/jobs/${app.job_id}`}
                    className="font-medium text-[#2563EB] hover:underline"
                  >
                    {app.job_title}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={statusVariant(app.status)}
                    className="capitalize"
                  >
                    {app.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatJobPostedAt(app.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
