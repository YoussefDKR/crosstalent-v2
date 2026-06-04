"use client";

import { useActionState, useTransition } from "react";
import { X } from "lucide-react";
import { addSkill, removeSkill, type ActionResult } from "@/app/candidate/actions";
import { SKILL_LEVELS } from "@/config/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CandidateSkill } from "@/types/candidate";

const initial: ActionResult = {};

type SkillsSectionProps = {
  skills: CandidateSkill[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
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
                  <span className="text-xs text-muted-foreground capitalize">
                    · {skill.level}
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
                  aria-label={`Remove ${skill.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add at least 3 skills employers search for (e.g. React, Python, UX).
        </p>
      )}

      <form action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="skillName">Add skill</Label>
          <Input
            id="skillName"
            name="name"
            placeholder="e.g. TypeScript"
            required
            disabled={pending}
          />
        </div>
        <div className="w-full space-y-2 sm:w-40">
          <Label htmlFor="skillLevel">Level</Label>
          <select
            id="skillLevel"
            name="level"
            disabled={pending}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            <option value="">Optional</option>
            {SKILL_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
        >
          Add
        </Button>
      </form>
    </div>
  );
}
