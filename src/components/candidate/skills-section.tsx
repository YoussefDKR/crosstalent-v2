"use client";

import { useActionState, useTransition } from "react";
import { X } from "lucide-react";
import { addSkill, removeSkill, type ActionResult } from "@/app/candidate/actions";
import { SKILL_LEVELS } from "@/config/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";
import type { CandidateSkill } from "@/types/candidate";

const initial: ActionResult = {};

type SkillsSectionProps = {
  skills: CandidateSkill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(addSkill, initial);
  const [removing, startRemove] = useTransition();

  return (
    <div className="space-y-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-[#10B981]/10 px-3 py-2 text-sm text-[#047857]">
          {state.success}
        </p>
      )}

      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill.id}>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-lg py-1.5 pr-1.5 pl-3 text-[#0F172A]"
              >
                {skill.name}
                {skill.level && (
                  <span className="text-xs text-muted-foreground">
                    ·{" "}
                    {t(`candidate.profileForm.skillLevels.${skill.level}`)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    startRemove(async () => {
                      await removeSkill(skill.id);
                    })
                  }
                  disabled={removing}
                  className="ml-1 rounded p-0.5 hover:bg-muted"
                  aria-label={t("candidate.profileForm.removeItem", {
                    name: skill.name,
                  })}
                >
                  <X className="size-3.5" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("candidate.profileForm.skillsEmpty")}
        </p>
      )}

      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="skillName">
            {t("candidate.profileForm.addSkill")}
          </Label>
          <Input
            id="skillName"
            name="name"
            placeholder={t("candidate.profileForm.skillPlaceholder")}
            required
            disabled={pending}
          />
        </div>
        <div className="w-full space-y-2 sm:w-40">
          <Label htmlFor="skillLevel">
            {t("candidate.profileForm.level")}
          </Label>
          <select
            id="skillLevel"
            name="level"
            disabled={pending}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="">{t("candidate.profileForm.optional")}</option>
            {SKILL_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {t(`candidate.profileForm.skillLevels.${l.value}`)}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
        >
          {t("candidate.profileForm.add")}
        </Button>
      </form>
    </div>
  );
}
