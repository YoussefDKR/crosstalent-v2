import { XMLParser } from "fast-xml-parser";
import type { ParsedImportedJob } from "@/lib/jobs/import-types";
import {
  mapEmploymentType,
  parseDate,
  parseSkills,
  stripHtml,
} from "@/lib/jobs/import-helpers";
import type { JobSourceConfig } from "@/lib/jobs/job-sources";

const DEFAULT_USER_AGENT = "CrossTalent/1.0 (+https://crosstalent.io)";

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function splitTitle(title: string): { company: string; role: string } {
  const idx = title.indexOf(": ");
  if (idx > 0) {
    return {
      company: title.slice(0, idx).trim(),
      role: title.slice(idx + 2).trim(),
    };
  }
  return { company: "Remote company", role: title.trim() };
}

function itemGuid(item: Record<string, unknown>, link: string): string {
  const guid = item.guid;
  if (typeof guid === "string" && guid.trim()) return guid.trim();
  if (typeof guid === "object" && guid && "#text" in guid) {
    const text = (guid as { "#text"?: string })["#text"];
    if (text?.trim()) return text.trim();
  }
  return link;
}

function parseItem(item: Record<string, unknown>): ParsedImportedJob | null {
  let link = "";
  if (typeof item.link === "string") link = item.link;
  else if (
    typeof item.link === "object" &&
    item.link &&
    "@_href" in item.link &&
    typeof (item.link as { "@_href"?: string })["@_href"] === "string"
  ) {
    link = (item.link as { "@_href": string })["@_href"];
  } else if (typeof item.url === "string") {
    link = item.url;
  } else if (typeof item.id === "string" && item.id.startsWith("http")) {
    link = item.id;
  }
  if (!link) return null;

  const rawTitle = String(item.title ?? "Remote role");
  const { company, role } = splitTitle(rawTitle);

  const description = stripHtml(
    String(item.description ?? item["content:encoded"] ?? item.summary ?? "")
  ).slice(0, 12_000);

  if (!description && !role) return null;

  const region =
    typeof item.region === "string" && item.region.trim()
      ? item.region.trim()
      : null;
  const country =
    typeof item.country === "string" && item.country.trim()
      ? item.country.trim()
      : null;

  const dateRaw =
    (typeof item.pubDate === "string" && item.pubDate) ||
    (typeof item.published === "string" && item.published) ||
    (typeof item.updated === "string" && item.updated) ||
    null;

  return {
    external_guid: itemGuid(item, link),
    external_url: link,
    title: role || rawTitle,
    company,
    description: description || `${role} — apply on We Work Remotely.`,
    skills: parseSkills(item.skills ?? item.category),
    location_city: region,
    location_country: country,
    published_at: parseDate(dateRaw),
    employment_type: mapEmploymentType(
      typeof item.job_type === "string" ? item.job_type : null
    ),
  };
}

export async function fetchFeedJobs(
  feed: JobSourceConfig
): Promise<ParsedImportedJob[]> {
  const response = await fetch(feed.url, {
    headers: { "User-Agent": feed.userAgent ?? DEFAULT_USER_AGENT },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`${feed.label}: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
  });

  const doc = parser.parse(xml) as {
    rss?: { channel?: { item?: unknown } };
    feed?: { entry?: unknown };
  };

  const rssItems = asArray(
    doc.rss?.channel?.item as Record<string, unknown> | undefined
  );
  const atomEntries = asArray(
    doc.feed?.entry as Record<string, unknown> | undefined
  );
  const items = rssItems.length > 0 ? rssItems : atomEntries;

  return items
    .map((item) => parseItem(item as Record<string, unknown>))
    .filter((job): job is ParsedImportedJob => job !== null)
    .slice(0, feed.maxItems);
}
