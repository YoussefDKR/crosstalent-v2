import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { listAdminApplications } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Applications — Admin",
};

export default async function AdminApplicationsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const applications = await listAdminApplications();

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            Applications
          </h1>
          <p className="mt-2 text-muted-foreground">
            Every candidate application across published jobs.
          </p>
        </header>
        <p className="text-sm text-muted-foreground">
          {applications.length}{" "}
          {applications.length === 1 ? "application" : "applications"}
        </p>
        <AdminApplicationsTable applications={applications} />
      </div>
    </AdminAppShell>
  );
}
