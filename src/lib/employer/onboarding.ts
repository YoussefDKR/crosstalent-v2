import type { CompanyProfileRow } from "@/types/employer";

export function normalizeWebsiteUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidWebsiteUrl(raw: string): boolean {
  const normalized = normalizeWebsiteUrl(raw);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    return Boolean(url.hostname && url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function isEmployerCompanyComplete(
  company: Pick<CompanyProfileRow, "company_name" | "website"> | null | undefined
): boolean {
  return Boolean(
    company?.company_name?.trim() && company?.website?.trim()
  );
}
