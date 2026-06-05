import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminFilters } from "@/components/admin/admin-filters";
import { AdminJobsTable } from "@/components/admin/admin-jobs-table";
import { getCurrentProfile } from "@/lib/auth/session";
import { listAdminJobs } from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Jobs — Admin",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const params = await searchParams;
  const status =
    typeof params.status === "string" ? params.status : "all";
  const source =
    typeof params.source === "string" ? params.source : "all";

  const jobs = await listAdminJobs({ status, source });

  return (
    <AdminAppShell profile={profile}>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            Jobs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review employer posts and curated RSS listings. Publish drafts to
            make them live on the job board.
          </p>
        </header>

        <div className="space-y-3">
          <AdminFilters
            basePath="/admin/jobs"
            param="status"
            active={status}
            extraParams={source !== "all" ? { source } : {}}
            options={[
              { label: "All statuses", value: "all" },
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
              { label: "Closed", value: "closed" },
            ]}
          />
          <AdminFilters
            basePath="/admin/jobs"
            param="source"
            active={source}
            extraParams={status !== "all" ? { status } : {}}
            options={[
              { label: "All sources", value: "all" },
              { label: "Employer posts", value: "platform" },
              { label: "RSS curated", value: "rss" },
            ]}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </p>
        <AdminJobsTable jobs={jobs} />
      </div>
    </AdminAppShell>
  );
}
