"use client";

import { Badge } from "@/components/ui/badge";
import { AdminJobActions } from "@/components/admin/admin-job-actions";
import { useI18n } from "@/context/i18n-provider";
import { rssSourceLabel } from "@/lib/jobs/source";
import { formatJobPostedAt } from "@/lib/jobs/format";
import type { AdminJobRow } from "@/lib/admin/types";
import type { JobStatus } from "@/types/jobs";

type AdminJobsTableProps = {
  jobs: AdminJobRow[];
};

function statusVariant(
  status: AdminJobRow["status"]
): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "closed") return "outline";
  return "secondary";
}

function locationLabel(
  city: string | null,
  country: string | null,
  fallback: string
): string {
  if (city && country) return `${city}, ${country}`;
  return city ?? country ?? fallback;
}

export function AdminJobsTable({ jobs }: AdminJobsTableProps) {
  const { t } = useI18n();

  function statusLabel(status: JobStatus): string {
    const map: Record<JobStatus, string> = {
      draft: t("admin.statusDraft"),
      published: t("admin.statusPublished"),
      closed: t("admin.statusClosed"),
    };
    return map[status] ?? status;
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">{t("admin.noJobsFound")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("admin.noJobsHint")}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-white shadow-sm">
      {jobs.map((job) => {
        const company =
          job.source_type === "rss"
            ? job.rss_company_name ?? t("admin.curated")
            : job.employer_name ?? job.employer_email ?? t("admin.employerFallback");

        return (
          <li
            key={job.id}
            className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-[#0F172A]">{job.title}</h3>
                <Badge variant={statusVariant(job.status)}>
                  {statusLabel(job.status)}
                </Badge>
                <Badge variant="outline">
                  {job.source_type === "rss"
                    ? `${t("admin.curated")} · ${rssSourceLabel(job.external_source)}`
                    : t("admin.employerPost")}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {company} ·{" "}
                {locationLabel(
                  job.location_city,
                  job.location_country,
                  t("admin.locationFlexible")
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("admin.created")} {formatJobPostedAt(job.created_at)}
                {job.published_at &&
                  ` · ${t("admin.publishedAt")} ${formatJobPostedAt(job.published_at)}`}
              </p>
              {job.status === "draft" && job.source_type === "platform" && (
                <p className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
                  {t("admin.notOnJobBoard")}
                </p>
              )}
              {job.source_type === "rss" && job.external_source && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("admin.syncedFromRss")}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <AdminJobActions
                jobId={job.id}
                status={job.status}
                sourceType={job.source_type}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
