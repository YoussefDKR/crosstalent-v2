import {
  JOB_SOURCE_LABELS,
  type JobImportSourceId,
} from "@/lib/jobs/job-sources";
import type { JobRow } from "@/types/jobs";

export function isRssJob(job: Pick<JobRow, "source_type">): boolean {
  return job.source_type === "rss";
}

export function rssSourceLabel(
  source: string | null | undefined
): string | null {
  if (!source) return null;
  return JOB_SOURCE_LABELS[source as JobImportSourceId] ?? source;
}
