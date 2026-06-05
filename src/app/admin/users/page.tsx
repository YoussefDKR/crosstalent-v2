import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminUserSearch } from "@/components/admin/admin-user-search";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { listAdminUsers } from "@/lib/admin/queries";
import type { UserRole } from "@/types";

export const metadata: Metadata = {
  title: "Users — Admin",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const params = await searchParams;
  const roleParam = typeof params.role === "string" ? params.role : "all";
  const q = typeof params.q === "string" ? params.q : "";
  const role =
    roleParam === "candidate" ||
    roleParam === "employer" ||
    roleParam === "admin"
      ? (roleParam as UserRole)
      : "all";

  const users = await listAdminUsers({ role, q });

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            Users
          </h1>
          <p className="mt-2 text-muted-foreground">
            All candidates, employers, and admins on the platform.
          </p>
        </header>
        <AdminUserSearch role={role} q={q} />
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
        <AdminUsersTable users={users} />
      </div>
    </AdminAppShell>
  );
}
