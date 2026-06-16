"use client";

import { useActionState, useTransition } from "react";
import { Briefcase, Trash2 } from "lucide-react";
import {
  addExperience,
  removeExperience,
  type ActionResult,
} from "@/app/candidate/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/i18n-provider";
import type { CandidateExperience } from "@/types/candidate";

const initial: ActionResult = {};

type ExperienceSectionProps = {
  experiences: CandidateExperience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const { t, locale } = useI18n();
  const [state, action, pending] = useActionState(addExperience, initial);
  const [removing, startRemove] = useTransition();

  function formatDateRange(exp: CandidateExperience) {
    const start = new Date(exp.startDate).toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });
    if (exp.isCurrent) return `${start} – ${t("candidate.profileForm.present")}`;
    if (!exp.endDate) return start;
    const end = new Date(exp.endDate).toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });
    return `${start} – ${end}`;
  }

  return (
    <div className="space-y-6">
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

      {experiences.length > 0 ? (
        <ul className="space-y-4">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="flex gap-4 rounded-lg border border-border p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0F172A]/5 text-[#0F172A]">
                <Briefcase className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#0F172A]">{exp.title}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                <p className="mt-1 text-xs text-[#2563EB]">
                  {formatDateRange(exp)}
                </p>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-red-600"
                disabled={removing}
                onClick={() =>
                  startRemove(async () => {
                    await removeExperience(exp.id);
                  })
                }
                aria-label={t("candidate.profileForm.removeExperience")}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("candidate.profileForm.experienceEmpty")}
        </p>
      )}

      <form
        action={action}
        className="space-y-4 rounded-lg border border-dashed border-border bg-slate-50/50 p-4"
      >
        <p className="text-sm font-medium text-[#0F172A]">
          {t("candidate.profileForm.addExperienceTitle")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">
              {t("candidate.profileForm.company")}
            </Label>
            <Input id="company" name="company" required disabled={pending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">
              {t("candidate.profileForm.jobTitle")}
            </Label>
            <Input id="title" name="title" required disabled={pending} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="expLocation">
            {t("candidate.profileForm.location")}
          </Label>
          <Input
            id="expLocation"
            name="location"
            placeholder={t("candidate.profileForm.locationPlaceholder")}
            disabled={pending}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">
              {t("candidate.profileForm.startDate")}
            </Label>
            <Input
              id="startDate"
              name="startDate"
              type="month"
              required
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">
              {t("candidate.profileForm.endDate")}
            </Label>
            <Input
              id="endDate"
              name="endDate"
              type="month"
              disabled={pending}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isCurrent"
            className="rounded border-input"
          />
          {t("candidate.profileForm.currentlyWorkHere")}
        </label>
        <div className="space-y-2">
          <Label htmlFor="description">
            {t("candidate.profileForm.description")}
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={3}
            placeholder={t("candidate.profileForm.descriptionPlaceholder")}
            disabled={pending}
          />
        </div>
        <Button type="submit" disabled={pending} variant="brand">
          {t("candidate.profileForm.addExperience")}
        </Button>
      </form>
    </div>
  );
}
