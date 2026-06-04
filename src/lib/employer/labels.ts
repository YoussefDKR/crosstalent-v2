import { LANGUAGE_PROFICIENCIES, SKILL_LEVELS } from "@/config/candidate";
import type { LanguageProficiency, SkillLevel } from "@/types/candidate";

export function skillLevelLabel(level: SkillLevel | null): string {
  if (!level) return "";
  return SKILL_LEVELS.find((l) => l.value === level)?.label ?? level;
}

export function languageProficiencyLabel(
  proficiency: LanguageProficiency
): string {
  return (
    LANGUAGE_PROFICIENCIES.find((p) => p.value === proficiency)?.label ??
    proficiency
  );
}
