import { createAdminClient } from "@/lib/supabase/admin";
import { RSS_FEEDS, type RssFeedSource } from "@/lib/jobs/rss-feeds";
import { fetchFeedJobs } from "@/lib/jobs/rss-parser";

export type RssSyncResult = {
  source: RssFeedSource;
  fetched: number;
  upserted: number;
  error?: string;
};

export type RssSyncSummary = {
  results: RssSyncResult[];
  totalUpserted: number;
};

export async function syncRssJobs(): Promise<RssSyncSummary> {
  const supabase = createAdminClient();
  const results: RssSyncResult[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const jobs = await fetchFeedJobs(feed);
      if (jobs.length === 0) {
        results.push({ source: feed.id, fetched: 0, upserted: 0 });
        continue;
      }

      const rows = jobs.map((job) => ({
        source_type: "rss" as const,
        employer_id: null,
        title: job.title,
        description: job.description,
        requirements: null,
        employment_type: "full_time",
        experience_level: "mid",
        remote_type: "remote",
        location_city: job.location_city,
        location_country: job.location_country,
        skills: job.skills,
        languages: [] as string[],
        status: "published" as const,
        published_at: job.published_at ?? new Date().toISOString(),
        external_url: job.external_url,
        external_source: feed.id,
        external_guid: job.external_guid,
        rss_company_name: job.company,
      }));

      const { error } = await supabase.from("jobs").upsert(rows, {
        onConflict: "external_source,external_guid",
        ignoreDuplicates: false,
      });

      if (error) {
        results.push({
          source: feed.id,
          fetched: jobs.length,
          upserted: 0,
          error: error.message,
        });
        continue;
      }

      results.push({
        source: feed.id,
        fetched: jobs.length,
        upserted: jobs.length,
      });
    } catch (err) {
      results.push({
        source: feed.id,
        fetched: 0,
        upserted: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    results,
    totalUpserted: results.reduce((sum, r) => sum + r.upserted, 0),
  };
}
