"use client";

import { useActionState, useTransition } from "react";
import { X } from "lucide-react";
import {
  addLanguage,
  removeLanguage,
  type ActionResult,
} from "@/app/candidate/actions";
import { COMMON_LANGUAGES, LANGUAGE_PROFICIENCIES } from "@/config/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CandidateLanguage } from "@/types/candidate";

const initial: ActionResult = {};

type LanguagesSectionProps = {
  languages: CandidateLanguage[];
};

export function LanguagesSection({ languages }: LanguagesSectionProps) {
  const [state, action, pending] = useActionState(addLanguage, initial);
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

      {languages.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <li key={lang.id}>
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-lg py-1.5 pr-1.5 pl-3"
              >
                {lang.language}
                <span className="text-xs text-muted-foreground capitalize">
                  · {lang.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    startRemove(async () => {
                      await removeLanguage(lang.id);
                    })
                  }
                  disabled={removing}
                  className="ml-1 rounded p-0.5 hover:bg-muted"
                  aria-label={`Remove ${lang.language}`}
                >
                  <X className="size-3.5" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add languages you speak — Arabic, French, and English are highly valued
          in cross-border roles.
        </p>
      )}

      <form action={action} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              list="language-suggestions"
              placeholder="e.g. French"
              required
              disabled={pending}
            />
            <datalist id="language-suggestions">
              {COMMON_LANGUAGES.map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency</Label>
            <select
              id="proficiency"
              name="proficiency"
              required
              disabled={pending}
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="">Select level</option>
              {LANGUAGE_PROFICIENCIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90"
        >
          Add language
        </Button>
      </form>
    </div>
  );
}
