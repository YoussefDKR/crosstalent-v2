import { Badge } from "@/components/ui/badge";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminUserRow } from "@/lib/admin/types";

type AdminUsersTableProps = {
  users: AdminUserRow[];
};

function roleVariant(
  role: AdminUserRow["role"]
): "default" | "secondary" | "outline" {
  if (role === "employer") return "default";
  if (role === "admin") return "outline";
  return "secondary";
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">No users found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a different search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-[#F8FAFC] text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#F8FAFC]/80">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar
                      pathOrUrl={user.avatar_url}
                      name={user.full_name}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-[#0F172A]">
                        {user.full_name ?? "Unnamed"}
                      </p>
                      <p className="truncate text-muted-foreground">
                        {user.email ?? "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={roleVariant(user.role)} className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatJobPostedAt(user.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
