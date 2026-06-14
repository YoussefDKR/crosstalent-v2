import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminFilters } from "@/components/admin/admin-filters";
import { AdminJobsTable } from "@/components/admin/admin-jobs-table";
import { AdminSyncJobsButton } from "@/components/admin/admin-sync-jobs-button";
import { getCurrentProfile } from "@/lib/auth/session";
import { listAdminJobs } from "@/lib/admin/queries";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Jobs — Admin",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { t } = await getServerI18n();
  const params = await searchParams;
  const status =
    typeof params.status === "string" ? params.status : "all";
  const source =
    typeof params.source === "string" ? params.source : "all";

  const jobs = await listAdminJobs({ status, source });

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
              {t("admin.jobsTitle")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("admin.jobsSubtitle")}</p>
          </div>
          <AdminSyncJobsButton />
        </header>

        <div className="space-y-3">
          <AdminFilters
            basePath="/admin/jobs"
            param="status"
            active={status}
            extraParams={source !== "all" ? { source } : {}}
            options={[
              { label: t("admin.filterAllStatuses"), value: "all" },
              { label: t("admin.filterDraft"), value: "draft" },
              { label: t("admin.filterPublished"), value: "published" },
              { label: t("admin.filterClosed"), value: "closed" },
            ]}
          />
          <AdminFilters
            basePath="/admin/jobs"
            param="source"
            active={source}
            extraParams={status !== "all" ? { status } : {}}
            options={[
              { label: t("admin.filterAllSources"), value: "all" },
              { label: t("admin.filterEmployerPosts"), value: "platform" },
              { label: t("admin.filterRssCurated"), value: "rss" },
            ]}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {jobs.length}{" "}
          {jobs.length === 1 ? t("admin.jobSingular") : t("admin.jobPlural")}
        </p>
        <AdminJobsTable jobs={jobs} />
      </div>
    </AdminAppShell>
  );
}
