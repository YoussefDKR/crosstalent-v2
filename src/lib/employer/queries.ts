import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import type { CompanyProfileData, CompanyProfileRow } from "@/types/employer";

export async function ensureCompanyProfileRow(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("company_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
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
