"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth/session";
import { ensureCandidateProfileRow } from "@/lib/candidate/queries";
import { createClient } from "@/lib/supabase/server";
import type { LanguageProficiency, SkillLevel } from "@/types/candidate";

export type ActionResult = {
  error?: string;
  success?: string;
};

const CANDIDATE_PATHS = ["/candidate/dashboard", "/candidate/profile"];

function revalidateCandidate() {
  CANDIDATE_PATHS.forEach((path) => revalidatePath(path));
}

async function requireCandidateId(): Promise<string> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") {
    throw new Error("Unauthorized");
  }
  await ensureCandidateProfileRow(profile.id);
  return profile.id;
}

export async function updateAccountInfo(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const fullName = String(formData.get("fullName") ?? "").trim();

    if (!fullName) {
      return { error: "Full name is required." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Account details saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function updateCandidateDetails(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();

    const payload = {
      headline: String(formData.get("headline") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      country_code: String(formData.get("countryCode") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      linkedin_url: String(formData.get("linkedinUrl") ?? "").trim() || null,
      portfolio_url: String(formData.get("portfolioUrl") ?? "").trim() || null,
    };

    const supabase = await createClient();
    const { error } = await supabase
      .from("candidate_profiles")
      .update(payload)
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Profile details saved." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function saveCvMetadata(
  cvPath: string,
  fileName: string
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();

    if (!cvPath.startsWith(`${userId}/`)) {
      return { error: "Invalid file path." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("candidate_profiles")
      .update({
        cv_path: cvPath,
        cv_file_name: fileName,
        cv_uploaded_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "CV uploaded successfully." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function removeCv(): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();

    const { data: row } = await supabase
      .from("candidate_profiles")
      .select("cv_path")
      .eq("user_id", userId)
      .single();

    if (row?.cv_path) {
      await supabase.storage.from("candidate-cvs").remove([row.cv_path]);
    }

    const { error } = await supabase
      .from("candidate_profiles")
      .update({
        cv_path: null,
        cv_file_name: null,
        cv_uploaded_at: null,
      })
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "CV removed." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function addSkill(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const name = String(formData.get("name") ?? "").trim();
    const level = String(formData.get("level") ?? "").trim() as SkillLevel | "";

    if (!name) return { error: "Skill name is required." };

    const supabase = await createClient();
    const { error } = await supabase.from("candidate_skills").insert({
      user_id: userId,
      name,
      level: level || null,
    });

    if (error) {
      if (error.code === "23505") return { error: "Skill already added." };
      return { error: error.message };
    }

    revalidateCandidate();
    return { success: "Skill added." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function removeSkill(skillId: string): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("candidate_skills")
      .delete()
      .eq("id", skillId)
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Skill removed." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function addLanguage(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const language = String(formData.get("language") ?? "").trim();
    const proficiency = String(
      formData.get("proficiency") ?? ""
    ).trim() as LanguageProficiency;

    if (!language || !proficiency) {
      return { error: "Language and proficiency are required." };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("candidate_languages").insert({
      user_id: userId,
      language,
      proficiency,
    });

    if (error) {
      if (error.code === "23505") return { error: "Language already added." };
      return { error: error.message };
    }

    revalidateCandidate();
    return { success: "Language added." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function removeLanguage(languageId: string): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("candidate_languages")
      .delete()
      .eq("id", languageId)
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Language removed." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function addExperience(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const company = String(formData.get("company") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim() || null;
    const startMonth = String(formData.get("startDate") ?? "").trim();
    const endMonth = String(formData.get("endDate") ?? "").trim();
    const isCurrent = formData.get("isCurrent") === "on";
    const startDate = startMonth ? `${startMonth}-01` : "";
    const endDate = endMonth && !isCurrent ? `${endMonth}-01` : null;
    const description = String(formData.get("description") ?? "").trim() || null;

    if (!company || !title || !startDate) {
      return { error: "Company, title, and start date are required." };
    }

    const supabase = await createClient();
    const { count } = await supabase
      .from("candidate_experiences")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    const { error } = await supabase.from("candidate_experiences").insert({
      user_id: userId,
      company,
      title,
      location,
      start_date: startDate,
      end_date: isCurrent ? null : endDate,
      is_current: isCurrent,
      description,
      sort_order: count ?? 0,
    });

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Experience added." };
  } catch {
    return { error: "Something went wrong." };
  }
}

export async function removeExperience(
  experienceId: string
): Promise<ActionResult> {
  try {
    const userId = await requireCandidateId();
    const supabase = await createClient();
    const { error } = await supabase
      .from("candidate_experiences")
      .delete()
      .eq("id", experienceId)
      .eq("user_id", userId);

    if (error) return { error: error.message };

    revalidateCandidate();
    return { success: "Experience removed." };
  } catch {
    return { error: "Something went wrong." };
  }
}
