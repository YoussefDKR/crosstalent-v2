import { headers } from "next/headers";

const HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
] as const;

export function normalizeCountryCode(
  value: string | null | undefined
): string | null {
  if (!value) return null;
  const code = value.trim().toUpperCase();
  if (code === "XX" || code === "T1") return null;
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

export async function getCountryFromRequestHeaders(): Promise<string | null> {
  const headerStore = await headers();
  for (const key of HEADER_KEYS) {
    const code = normalizeCountryCode(headerStore.get(key));
    if (code) return code;
  }
  return null;
}

export function countryDisplayName(code: string): string {
  if (code === "UNKNOWN") return "Unknown";
  try {
    return (
      new Intl.DisplayNames(["en"], { type: "region" }).of(code.toUpperCase()) ??
      code
    );
  } catch {
    return code;
  }
}
