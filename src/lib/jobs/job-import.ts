import type { ParsedImportedJob } from "@/lib/jobs/import-types";
import { fetchJsonJobs } from "@/lib/jobs/json-parser";
import type { JobSourceConfig } from "@/lib/jobs/job-sources";
import { fetchFeedJobs } from "@/lib/jobs/rss-parser";

export async function fetchJobsFromSource(
  source: JobSourceConfig
): Promise<ParsedImportedJob[]> {
  if (source.format === "rss") {
    return fetchFeedJobs(source);
  }
  return fetchJsonJobs(source);
}
