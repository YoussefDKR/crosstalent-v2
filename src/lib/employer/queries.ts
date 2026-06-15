import { createClient } from "@/lib/supabase/server";
import { EMPLOYER_ONBOARDING_PATH } from "@/lib/auth/routes";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";
import type { Profile } from "@/types";
import type { CompanyProfileData, CompanyProfileRow } from "@/types/employer";

export async function ensureCompanyProfileRow(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("company_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
}

export async function getEmployerEntryPath(userId: string): Promise<string> {
  const supabase = await createClient();
  await ensureCompanyProfileRow(userId);

  const { data: company } = await supabase
    .from("company_profiles")
    .select("company_name, website")
    .eq("user_id", userId)
    .maybeSingle();

  return isEmployerCompanyComplete(company)
    ? "/employer/dashboard"
    : EMPLOYER_ONBOARDING_PATH;
}

export async function getCompanyProfileData(
  account: Profile
): Promise<CompanyProfileData> {
  if (account.role !== "employer") {
    return {
      profile: {
        id: account.id,
        fullName: account.fullName,
        email: account.email,
        avatarUrl: account.avatarUrl,
      },
      company: null,
    };
  }

  const supabase = await createClient();
  await ensureCompanyProfileRow(account.id);

  const { data: company } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("user_id", account.id)
    .maybeSingle();

  return {
    profile: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      avatarUrl: account.avatarUrl,
    },
    company: (company ?? null) as CompanyProfileRow | null,
  };
}
