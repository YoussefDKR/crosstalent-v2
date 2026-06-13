"use server";

import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";
import { ensureCompanyProfileRow } from "@/lib/employer/queries";
import {
  isValidWebsiteUrl,
  normalizeWebsiteUrl,
} from "@/lib/employer/onboarding";
import { createClient } from "@/lib/supabase/server";

export type EmployerOnboardingResult = {
  error?: string;
};

export async function completeEmployerOnboarding(
  _prev: EmployerOnboardingResult,
  formData: FormData
): Promise<EmployerOnboardingResult> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return { error: "You must be signed in as an employer." };
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const websiteRaw = String(formData.get("website") ?? "").trim();

  if (!companyName) {
    return { error: "Company name is required." };
  }
  if (!isValidWebsiteUrl(websiteRaw)) {
    return { error: "Enter a valid website URL (e.g. yourcompany.com)." };
  }

  await ensureCompanyProfileRow(profile.id);
  const supabase = await createClient();
  const { error } = await supabase
    .from("company_profiles")
    .update({
      company_name: companyName,
      website: normalizeWebsiteUrl(websiteRaw),
    })
    .eq("user_id", profile.id);

  if (error) return { error: error.message };

  redirect("/employer/dashboard");
}
