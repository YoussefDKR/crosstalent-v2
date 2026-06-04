"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { ensureCompanyProfileRow } from "@/lib/employer/queries";
import { createClient } from "@/lib/supabase/server";

export type EmployerActionResult = {
  error?: string;
  success?: string;
};

const EMPLOYER_PATHS = [
  "/employer/dashboard",
  "/employer/company",
  "/employer/settings",
];

function revalidateEmployer() {
  EMPLOYER_PATHS.forEach((path) => revalidatePath(path));
}

async function requireEmployerId(): Promise<string> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    throw new Error("Unauthorized");
  }
  await ensureCompanyProfileRow(profile.id);
  return profile.id;
}

export async function updateCompanyProfile(
  _prev: EmployerActionResult,
  formData: FormData
): Promise<EmployerActionResult> {
  try {
    const userId = await requireEmployerId();

    const companySize = String(formData.get("companySize") ?? "").trim();
    const validSizes = ["1-10", "11-50", "51-200", "201-500", "500+"];

    const payload = {
      company_name: String(formData.get("companyName") ?? "").trim() || null,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      website: String(formData.get("website") ?? "").trim() || null,
      industry: String(formData.get("industry") ?? "").trim() || null,
      company_size: validSizes.includes(companySize)
        ? companySize
        : null,
      headquarters_city:
        String(formData.get("headquartersCity") ?? "").trim() || null,
      headquarters_country:
        String(formData.get("headquartersCountry") ?? "").trim() || null,
      hiring_in_regions:
        String(formData.get("hiringInRegions") ?? "").trim() || null,
      linkedin_url: String(formData.get("linkedinUrl") ?? "").trim() || null,
      contact_email:
        String(formData.get("contactEmail") ?? "").trim().toLowerCase() || null,
      contact_phone:
        String(formData.get("contactPhone") ?? "").trim() || null,
    };

    if (!payload.company_name) {
      return { error: "Company name is required." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("company_profiles")
      .update(payload)
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateEmployer();
    return { success: "Company profile saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}
