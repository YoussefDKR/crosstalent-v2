import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminApplicationsTable } from "@/components/admin/admin-applications-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { listAdminApplications } from "@/lib/admin/queries";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Applications — Admin",
};

export default async function AdminApplicationsPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { t } = await getServerI18n();
  const applications = await listAdminApplications();

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            {t("admin.applicationsTitle")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("admin.applicationsSubtitle")}
          </p>
        </header>
        <p className="text-sm text-muted-foreground">
          {applications.length}{" "}
          {applications.length === 1
            ? t("admin.applicationSingular")
            : t("admin.applicationPlural")}
        </p>
        <AdminApplicationsTable applications={applications} />
      </div>
    </AdminAppShell>
  );
}
