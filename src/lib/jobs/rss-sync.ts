import { createAdminClient } from "@/lib/supabase/admin";
import { fetchJobsFromSource } from "@/lib/jobs/job-import";
import type { ParsedImportedJob } from "@/lib/jobs/import-types";
import { prepareImportedJob, isOpenToEuropeanCandidates } from "@/lib/jobs/location-normalize";
import {
  JOB_IMPORT_SOURCES,
  type JobImportSourceId,
} from "@/lib/jobs/job-sources";

export type RssSyncResult = {
  source: JobImportSourceId;
  fetched: number;
  upserted: number;
  error?: string;
};

export type RssSyncSummary = {
  results: RssSyncResult[];
  totalUpserted: number;
  closedNonEuropean: number;
};

export async function syncRssJobs(): Promise<RssSyncSummary> {
  const supabase = createAdminClient();
  const results: RssSyncResult[] = [];

  for (const source of JOB_IMPORT_SOURCES) {
    try {
      const jobs = await fetchJobsFromSource(source);
      const prepared = jobs
        .map((job) => prepareImportedJob(job, source.id))
        .filter((job): job is ParsedImportedJob => job !== null);

      if (prepared.length === 0) {
        results.push({ source: source.id, fetched: jobs.length, upserted: 0 });
        continue;
      }

      const rows = prepared.map((job) => ({
        source_type: "rss" as const,
        employer_id: null,
        title: job.title,
        description: job.description,
        requirements: null,
        employment_type: job.employment_type,
        experience_level: "mid",
        remote_type: "remote",
        location_city: job.location_city,
        location_country: job.location_country,
        skills: job.skills,
        languages: [] as string[],
        status: "published" as const,
        published_at: job.published_at ?? new Date().toISOString(),
        external_url: job.external_url,
        external_source: source.id,
        external_guid: job.external_guid,
        rss_company_name: job.company,
      }));

      const guids = rows.map((row) => row.external_guid).filter(Boolean);
      const { data: existing, error: lookupError } = await supabase
        .from("jobs")
        .select("id, external_guid")
        .eq("source_type", "rss")
        .eq("external_source", source.id)
        .in("external_guid", guids);

      if (lookupError) {
        results.push({
          source: source.id,
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
            source: source.id,
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
            employment_type: row.employment_type,
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
          source: source.id,
          fetched: jobs.length,
          upserted,
          error: updateFailed,
        });
        continue;
      }

      results.push({
        source: source.id,
        fetched: jobs.length,
        upserted,
      });
    } catch (err) {
      results.push({
        source: source.id,
        fetched: 0,
        upserted: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  const closed = await closeNonEuropeanRssJobs();

  return {
    results,
    totalUpserted: results.reduce((sum, r) => sum + r.upserted, 0),
    closedNonEuropean: closed,
  };
}

/** Hide legacy RSS imports that are not open to European candidates. */
export async function closeNonEuropeanRssJobs(): Promise<number> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("id, location_country, location_city")
    .eq("source_type", "rss")
    .eq("status", "published");

  if (error || !data?.length) return 0;

  const toClose = data.filter(
    (job) =>
      !isOpenToEuropeanCandidates(job.location_country, job.location_city)
  );

  if (toClose.length === 0) return 0;

  const { error: updateError } = await supabase
    .from("jobs")
    .update({ status: "closed" })
    .in(
      "id",
      toClose.map((j) => j.id)
    );

  if (updateError) return 0;
  return toClose.length;
}
