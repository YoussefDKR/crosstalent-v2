import { MENA_COUNTRIES } from "@/config/candidate";
import { createClient } from "@/lib/supabase/server";
import { calculateProfileCompletion } from "@/lib/candidate/completion";
import { getCvSignedUrl } from "@/lib/candidate/queries";
import type {
  CandidateExperience,
  CandidateLanguage,
  CandidateProfileData,
  CandidateSkill,
  LanguageProficiency,
  SkillLevel,
} from "@/types/candidate";
import type {
  CandidateDetailForEmployer,
  CandidateListItem,
  CandidateSearchFilters,
} from "@/types/employer-search";

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

export function parseCandidateFilters(
  params: Record<string, string | string[] | undefined>
): CandidateSearchFilters {
  const get = (key: string) => {
    const v = params[key];
    return typeof v === "string" ? v : undefined;
  };

  return {
    q: get("q"),
    country: get("country"),
    skill: get("skill"),
    language: get("language"),
    hasCv: get("hasCv") === "1",
  };
}

function completionPercent(data: CandidateProfileData): number {
  return calculateProfileCompletion(data).percent;
}

function toProfileData(
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  },
  details: {
    user_id: string;
    headline: string | null;
    bio: string | null;
    location: string | null;
    country_code: string | null;
    phone: string | null;
    cv_path: string | null;
    cv_file_name: string | null;
    cv_uploaded_at: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    created_at: string;
    updated_at: string;
  } | null,
  skills: CandidateSkill[],
  languages: CandidateLanguage[],
  experiences: CandidateExperience[]
): CandidateProfileData {
  return {
    profile: {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
    },
    details: details
      ? {
          user_id: details.user_id,
          headline: details.headline,
          bio: details.bio,
          location: details.location,
          country_code: details.country_code,
          phone: details.phone,
          cv_path: details.cv_path,
          cv_file_name: details.cv_file_name,
          cv_uploaded_at: details.cv_uploaded_at,
          linkedin_url: details.linkedin_url,
          portfolio_url: details.portfolio_url,
          created_at: details.created_at,
          updated_at: details.updated_at,
        }
      : null,
    skills,
    languages,
    experiences,
  };
}

export type CandidateSearchResult = {
  candidates: CandidateListItem[];
  error?: string;
};

export async function searchCandidates(
  filters: CandidateSearchFilters = {}
): Promise<CandidateSearchResult> {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, created_at")
    .eq("role", "candidate")
    .order("created_at", { ascending: false });

  if (profilesError) {
    return { candidates: [], error: profilesError.message };
  }

  if (!profiles?.length) return { candidates: [] };

  const ids = profiles.map((p) => p.id);

  const [detailsRes, skillsRes, languagesRes, experiencesRes] =
    await Promise.all([
      supabase.from("candidate_profiles").select("*").in("user_id", ids),
      supabase
        .from("candidate_skills")
        .select("id, user_id, name, level")
        .in("user_id", ids),
      supabase
        .from("candidate_languages")
        .select("id, user_id, language, proficiency")
        .in("user_id", ids),
      supabase
        .from("candidate_experiences")
        .select("*")
        .in("user_id", ids)
        .order("sort_order", { ascending: true }),
    ]);

  const detailsByUser = new Map(
    (detailsRes.data ?? []).map((d) => [d.user_id, d])
  );

  const skillsByUser = new Map<string, CandidateSkill[]>();
  for (const row of skillsRes.data ?? []) {
    const list = skillsByUser.get(row.user_id) ?? [];
    list.push({
      id: row.id,
      name: row.name,
      level: row.level as SkillLevel | null,
    });
    skillsByUser.set(row.user_id, list);
  }

  const languagesByUser = new Map<string, CandidateLanguage[]>();
  for (const row of languagesRes.data ?? []) {
    const list = languagesByUser.get(row.user_id) ?? [];
    list.push({
      id: row.id,
      language: row.language,
      proficiency: row.proficiency as LanguageProficiency,
    });
    languagesByUser.set(row.user_id, list);
  }

  const experiencesByUser = new Map<string, CandidateExperience[]>();
  for (const row of experiencesRes.data ?? []) {
    const list = experiencesByUser.get(row.user_id) ?? [];
    list.push(mapExperience(row));
    experiencesByUser.set(row.user_id, list);
  }

  let items: CandidateListItem[] = profiles.map((profile) => {
    const details = detailsByUser.get(profile.id) ?? null;
    const skills = skillsByUser.get(profile.id) ?? [];
    const languages = languagesByUser.get(profile.id) ?? [];
    const experiences = experiencesByUser.get(profile.id) ?? [];
    const data = toProfileData(profile, details, skills, languages, experiences);

    return {
      id: profile.id,
      fullName: profile.full_name,
      email: profile.email,
      avatarUrl: profile.avatar_url,
      headline: details?.headline ?? null,
      bio: details?.bio ?? null,
      location: details?.location ?? null,
      countryCode: details?.country_code ?? null,
      hasCv: Boolean(details?.cv_path),
      skills,
      languages,
      completionPercent: completionPercent(data),
    };
  });

  if (filters.country) {
    items = items.filter((c) => c.countryCode === filters.country);
  }

  if (filters.hasCv) {
    items = items.filter((c) => c.hasCv);
  }

  if (filters.skill) {
    const skillLower = filters.skill.toLowerCase();
    items = items.filter((c) =>
      c.skills.some((s) => s.name.toLowerCase().includes(skillLower))
    );
  }

  if (filters.language) {
    const langLower = filters.language.toLowerCase();
    items = items.filter((c) =>
      c.languages.some((l) => l.language.toLowerCase().includes(langLower))
    );
  }

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (c) =>
        (c.fullName?.toLowerCase().includes(q) ?? false) ||
        (c.headline?.toLowerCase().includes(q) ?? false) ||
        (c.bio?.toLowerCase().includes(q) ?? false) ||
        (c.location?.toLowerCase().includes(q) ?? false) ||
        c.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  items.sort((a, b) => b.completionPercent - a.completionPercent);

  return { candidates: items };
}

export async function getCandidateForEmployer(
  candidateId: string
): Promise<CandidateDetailForEmployer | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role")
    .eq("id", candidateId)
    .eq("role", "candidate")
    .maybeSingle();

  if (profileError || !profile) return null;

  const [detailsRes, skillsRes, languagesRes, experiencesRes] =
    await Promise.all([
      supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", candidateId)
        .maybeSingle(),
      supabase
        .from("candidate_skills")
        .select("id, name, level")
        .eq("user_id", candidateId)
        .order("created_at", { ascending: true }),
      supabase
        .from("candidate_languages")
        .select("id, language, proficiency")
        .eq("user_id", candidateId)
        .order("created_at", { ascending: true }),
      supabase
        .from("candidate_experiences")
        .select("*")
        .eq("user_id", candidateId)
        .order("sort_order", { ascending: true })
        .order("start_date", { ascending: false }),
    ]);

  const details = detailsRes.data;
  const skills: CandidateSkill[] = (skillsRes.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    level: s.level as SkillLevel | null,
  }));
  const languages: CandidateLanguage[] = (languagesRes.data ?? []).map(
    (l) => ({
      id: l.id,
      language: l.language,
      proficiency: l.proficiency as LanguageProficiency,
    })
  );
  const experiences = (experiencesRes.data ?? []).map(mapExperience);

  const data = toProfileData(profile, details, skills, languages, experiences);

  let cvSignedUrl: string | null = null;
  if (details?.cv_path) {
    cvSignedUrl = await getCvSignedUrl(details.cv_path);
  }

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    headline: details?.headline ?? null,
    bio: details?.bio ?? null,
    location: details?.location ?? null,
    countryCode: details?.country_code ?? null,
    phone: details?.phone ?? null,
    linkedinUrl: details?.linkedin_url ?? null,
    portfolioUrl: details?.portfolio_url ?? null,
    cvFileName: details?.cv_file_name ?? null,
    cvSignedUrl,
    skills,
    languages,
    experiences,
    completionPercent: completionPercent(data),
  };
}

export function countryLabel(code: string | null): string {
  if (!code) return "Location not set";
  return MENA_COUNTRIES.find((c) => c.code === code)?.label ?? code;
}
