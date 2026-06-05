import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminUserRow } from "@/lib/admin/types";

type AdminRecentSignupsProps = {
  users: AdminUserRow[];
};

function roleVariant(
  role: AdminUserRow["role"]
): "default" | "secondary" | "outline" {
  if (role === "employer") return "default";
  if (role === "admin") return "outline";
  return "secondary";
}

export function AdminRecentSignups({ users }: AdminRecentSignupsProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        No signups yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold text-[#0F172A]">Recent signups</h2>
        <Link
          href="/admin/users"
          className="text-sm font-medium text-[#2563EB] hover:underline"
        >
          View all
        </Link>
      </div>
      <ul className="divide-y divide-border">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-[#0F172A]">
                {user.full_name ?? "Unnamed user"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user.email ?? "No email"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={roleVariant(user.role)} className="capitalize">
                {user.role}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatJobPostedAt(user.created_at)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
