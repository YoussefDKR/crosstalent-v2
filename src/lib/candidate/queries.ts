import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import type {
  CandidateExperience,
  CandidateLanguage,
  CandidateProfileData,
  CandidateProfileRow,
  CandidateSkill,
  LanguageProficiency,
  SkillLevel,
} from "@/types/candidate";

function mapExperience(row: {
  id: string;
  company: string;
  title: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
}): CandidateExperience {
  return {
    id: row.id,
    company: row.company,
    title: row.title,
    location: row.location,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: row.is_current,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function emptyCandidateData(account: Profile): CandidateProfileData {
  return {
    profile: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      avatarUrl: account.avatarUrl,
    },
    details: null,
    skills: [],
    languages: [],
    experiences: [],
  };
}

export async function ensureCandidateProfileRow(
  userId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("candidate_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id" });
}

export async function getCandidateProfileData(
  account: Profile
): Promise<CandidateProfileData> {
  if (account.role !== "candidate") {
    return emptyCandidateData(account);
  }

  const supabase = await createClient();
  await ensureCandidateProfileRow(account.id);

  const [detailsRes, skillsRes, languagesRes, experiencesRes] =
    await Promise.all([
      supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", account.id)
        .maybeSingle(),
      supabase
        .from("candidate_skills")
        .select("id, name, level")
        .eq("user_id", account.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("candidate_languages")
        .select("id, language, proficiency")
        .eq("user_id", account.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("candidate_experiences")
        .select("*")
        .eq("user_id", account.id)
        .order("sort_order", { ascending: true })
        .order("start_date", { ascending: false }),
    ]);

  const details = (detailsRes.data ?? null) as CandidateProfileRow | null;

  const skills: CandidateSkill[] = (skillsRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    level: s.level as SkillLevel | null,
  }));

  const languages: CandidateLanguage[] = (languagesRes.data ?? []).map((l) => ({
    id: l.id,
    language: l.language,
    proficiency: l.proficiency as LanguageProficiency,
  }));

  const experiences: CandidateExperience[] = (experiencesRes.data ?? []).map(
    mapExperience
  );

  return {
    profile: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      avatarUrl: account.avatarUrl,
    },
    details,
    skills,
    languages,
    experiences,
  };
}

export async function getCvSignedUrl(
  cvPath: string,
  expiresIn = 3600
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("candidate-cvs")
    .createSignedUrl(cvPath, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
