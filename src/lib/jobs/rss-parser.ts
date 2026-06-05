import { XMLParser } from "fast-xml-parser";
import type { RssFeedConfig, RssFeedSource } from "@/lib/jobs/rss-feeds";

export type ParsedRssJob = {
  external_guid: string;
  external_url: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  location_country: string | null;
  location_city: string | null;
  published_at: string | null;
};

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
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

function parseSkills(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(/,|\band\b/gi)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 48)
    .slice(0, 8);
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

function parseItem(
  item: Record<string, unknown>,
  source: RssFeedSource
): ParsedRssJob | null {
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

  let published_at: string | null = null;
  const dateRaw =
    (typeof item.pubDate === "string" && item.pubDate) ||
    (typeof item.published === "string" && item.published) ||
    (typeof item.updated === "string" && item.updated) ||
    null;
  if (dateRaw) {
    const parsed = new Date(dateRaw);
    if (!Number.isNaN(parsed.getTime())) {
      published_at = parsed.toISOString();
    }
  }

  let companyName = company;
  if (source === "remotive" && typeof item.company === "string") {
    companyName = item.company.trim() || companyName;
  }

  return {
    external_guid: itemGuid(item, link),
    external_url: link,
    title: role || rawTitle,
    company: companyName,
    description: description || `${role} — apply on ${source}.`,
    skills: parseSkills(item.skills ?? item.category),
    location_city: region,
    location_country: country,
    published_at,
  };
}

export async function fetchFeedJobs(
  feed: RssFeedConfig
): Promise<ParsedRssJob[]> {
  const response = await fetch(feed.url, {
    headers: { "User-Agent": "CrossTalent/1.0 (job aggregator beta)" },
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
  const items =
    rssItems.length > 0 ? rssItems : atomEntries;

  return items
    .map((item) => parseItem(item as Record<string, unknown>, feed.id))
    .filter((job): job is ParsedRssJob => job !== null)
    .slice(0, feed.maxItems);
}
