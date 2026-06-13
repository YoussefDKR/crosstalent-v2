import type { EmploymentType } from "@/types/jobs";

export function stripHtml(html: string): string {
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
