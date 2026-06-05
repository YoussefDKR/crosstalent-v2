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

      const guids = rows.map((row) => row.external_guid).filter(Boolean);
      const { data: existing, error: lookupError } = await supabase
        .from("jobs")
        .select("id, external_guid")
        .eq("source_type", "rss")
        .eq("external_source", feed.id)
        .in("external_guid", guids);

      if (lookupError) {
        results.push({
          source: feed.id,
          fetched: jobs.length,
          upserted: 0,
          error: lookupError.message,
        });
        continue;
      }

      const existingByGuid = new Map(
        (existing ?? []).map((row) => [row.external_guid, row.id])
      );

      const toInsert = rows.filter((row) => !existingByGuid.has(row.external_guid));
      let upserted = 0;

      if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from("jobs").insert(toInsert);
        if (insertError) {
          results.push({
            source: feed.id,
            fetched: jobs.length,
            upserted: 0,
            error: insertError.message,
          });
          continue;
        }
        upserted += toInsert.length;
      }

      let updateFailed: string | undefined;
      for (const row of rows) {
        const id = existingByGuid.get(row.external_guid);
        if (!id) continue;

        const { error: updateError } = await supabase
          .from("jobs")
          .update({
            title: row.title,
            description: row.description,
            location_city: row.location_city,
            location_country: row.location_country,
            skills: row.skills,
            status: row.status,
            published_at: row.published_at,
            external_url: row.external_url,
            rss_company_name: row.rss_company_name,
          })
          .eq("id", id);

        if (updateError) {
          updateFailed = updateError.message;
          break;
        }
        upserted += 1;
      }

      if (updateFailed) {
        results.push({
          source: feed.id,
          fetched: jobs.length,
          upserted,
          error: updateFailed,
        });
        continue;
      }

      results.push({
        source: feed.id,
        fetched: jobs.length,
        upserted,
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
