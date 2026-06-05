import { RSS_SOURCE_LABELS, type RssFeedSource } from "@/lib/jobs/rss-feeds";
import type { JobRow } from "@/types/jobs";

export function isRssJob(job: Pick<JobRow, "source_type">): boolean {
  return job.source_type === "rss";
}

export function rssSourceLabel(
  source: string | null | undefined
): string | null {
  if (!source) return null;
  return RSS_SOURCE_LABELS[source as RssFeedSource] ?? source;
}
