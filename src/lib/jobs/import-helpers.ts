import type { EmploymentType } from "@/types/jobs";

const NAMED_HTML_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  mdash: "—",
  ndash: "–",
  hellip: "…",
  copy: "©",
  reg: "®",
  trade: "™",
};

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => {
      const num = Number(code);
      return Number.isFinite(num) ? String.fromCodePoint(num) : _;
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const num = parseInt(hex, 16);
      return Number.isFinite(num) ? String.fromCodePoint(num) : _;
    })
    .replace(/&([a-z]+);/gi, (match, name: string) => {
      const decoded = NAMED_HTML_ENTITIES[name.toLowerCase()];
      return decoded ?? match;
    });
}

export function stripHtml(html: string): string {
  const withBreaks = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ");

  const decoded = decodeHtmlEntities(withBreaks);

  return decoded
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/** Clean description text for display (also fixes legacy imports). */
export function formatJobDescription(text: string): string {
  if (!text.trim()) return text;

  const hasHtml = /<[^>]+>/.test(text);
  const hasEntities = /&(?:#\d+|#x[0-9a-f]+|[a-z]+);/i.test(text);
  const cleaned = hasHtml || hasEntities ? stripHtml(text) : decodeHtmlEntities(text);

  return cleaned.replace(/\n{3,}/g, "\n\n").trim();
}

export function parseSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === "string" ? stripHtml(item).trim() : ""))
      .filter((s) => s.length > 1 && s.length < 48)
      .slice(0, 8);
  }
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(/,|\band\b/gi)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 48)
    .slice(0, 8);
}

export function parseDate(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function mapEmploymentType(
  raw: string | null | undefined
): EmploymentType {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("part")) return "part_time";
  if (v.includes("contract") || v.includes("freelance")) return "contract";
  if (v.includes("intern")) return "internship";
  return "full_time";
}
