import type { ParsedImportedJob } from "@/lib/jobs/import-types";
import type { JobImportSourceId } from "@/lib/jobs/job-sources";
import { isLowQualityImportedListing } from "@/lib/jobs/import-quality";

/** ISO-style codes used in JOB_LOCATION_COUNTRIES + REMOTE for EU-wide remote */
const COUNTRY_ALIASES: Record<string, string> = {
  france: "FR",
  germany: "DE",
  deutschland: "DE",
  italy: "IT",
  italia: "IT",
  spain: "ES",
  españa: "ES",
  espana: "ES",
  netherlands: "NL",
  holland: "NL",
  belgium: "BE",
  portugal: "PT",
  ireland: "IE",
  austria: "AT",
  österreich: "AT",
  osterreich: "AT",
  switzerland: "CH",
  schweiz: "CH",
  suisse: "CH",
  "united kingdom": "UK",
  uk: "UK",
  england: "UK",
  scotland: "UK",
  wales: "UK",
  poland: "PL",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  finland: "FI",
  greece: "GR",
  romania: "RO",
  hungary: "HU",
  czechia: "CZ",
  "czech republic": "CZ",
  luxembourg: "LU",
  malta: "MT",
  cyprus: "CY",
  europe: "REMOTE",
  eu: "REMOTE",
  eea: "REMOTE",
  emea: "REMOTE",
  worldwide: "REMOTE",
  anywhere: "REMOTE",
  global: "REMOTE",
  remote: "REMOTE",
};

const EU_SIGNAL =
  /\beurope\b|\beu\b|\beea\b|\bemea\b|worldwide|anywhere|global|fully remote/i;

const US_ONLY =
  /^(usa|us|u\.s\.|united states)(\s+only)?$|usa only|us only|u\.s\. only|united states only/i;

const NON_EU_ONLY =
  /^(canada|mexico|brazil|australia|india|philippines|japan|china)(\s+only)?$/i;

export function normalizeLocationCountry(
  raw: string | null | undefined
): string | null {
  if (!raw?.trim()) return null;

  const trimmed = raw.trim().replace(/,+\s*$/, "");
  const lower = trimmed.toLowerCase();

  const direct = COUNTRY_ALIASES[lower];
  if (direct) return direct;

  if (EU_SIGNAL.test(trimmed)) return "REMOTE";

  for (const [alias, code] of Object.entries(COUNTRY_ALIASES)) {
    if (alias.length > 2 && lower.includes(alias)) {
      return code;
    }
  }

  if (trimmed.length === 2) return trimmed.toUpperCase();

  return trimmed;
}

export function isOpenToEuropeanCandidates(
  location: string | null | undefined,
  city?: string | null | undefined
): boolean {
  const combined = [location, city].filter(Boolean).join(" ").trim();
  if (!combined) return false;

  const lower = combined.toLowerCase();

  if (US_ONLY.test(lower)) return false;
  if (NON_EU_ONLY.test(lower) && !EU_SIGNAL.test(lower)) return false;

  if (EU_SIGNAL.test(combined)) return true;

  for (const alias of Object.keys(COUNTRY_ALIASES)) {
    if (alias.length > 2 && lower.includes(alias)) return true;
  }

  if (/\b(uk|fr|de|es|it|nl|be|pt|ie|at|ch|pl|se|no|dk|fi)\b/i.test(combined)) {
    return true;
  }

  return false;
}

const EU_PRE_FILTERED_SOURCES = new Set<JobImportSourceId>(["jobicy"]);

export function prepareImportedJob(
  job: ParsedImportedJob,
  sourceId: JobImportSourceId
): ParsedImportedJob | null {
  const location_country = normalizeLocationCountry(job.location_country);
  const location_city = job.location_city?.trim() || null;

  if (!EU_PRE_FILTERED_SOURCES.has(sourceId)) {
    if (!isOpenToEuropeanCandidates(location_country, location_city)) {
      return null;
    }
  }

  if (isLowQualityImportedListing(job.title, job.description)) {
    return null;
  }

  return {
    ...job,
    location_country,
    location_city,
  };
}
