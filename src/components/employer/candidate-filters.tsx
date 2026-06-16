"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  CANDIDATE_SEARCH_COUNTRIES,
  CANDIDATE_SEARCH_LANGUAGES,
  CANDIDATE_SEARCH_SKILLS,
} from "@/config/employer-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CandidateFilters() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const apply = useCallback(
    (form: HTMLFormElement) => {
      const data = new FormData(form);
      const params = new URLSearchParams();

      for (const [key, value] of data.entries()) {
        const v = String(value).trim();
        if (v) params.set(key, v);
      }

      if ((form.elements.namedItem("hasCv") as HTMLInputElement)?.checked) {
        params.set("hasCv", "1");
      }

      startTransition(() => {
        router.push(`/employer/candidates?${params.toString()}`);
      });
    },
    [router]
  );

  function clearFilters() {
    startTransition(() => router.push("/employer/candidates"));
  }

  return (
    <form
      className="rounded-lg border border-border bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        apply(e.currentTarget);
      }}
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#0F172A]">
        <SlidersHorizontal className="size-4 text-[#2563EB]" />
        {t("employer.candidateFilters.title")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="q">{t("employer.candidateFilters.search")}</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="q"
              name="q"
              placeholder={t("employer.candidateFilters.searchPlaceholder")}
              defaultValue={searchParams.get("q") ?? ""}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            {t("employer.candidateFilters.country")}
          </Label>
          <select
            id="country"
            name="country"
            defaultValue={searchParams.get("country") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("employer.candidateFilters.allMena")}</option>
            {CANDIDATE_SEARCH_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {t(`employer.menaCountries.${c.code}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill">{t("employer.candidateFilters.skill")}</Label>
          <select
            id="skill"
            name="skill"
            defaultValue={searchParams.get("skill") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("employer.candidateFilters.anySkill")}</option>
            {CANDIDATE_SEARCH_SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">
            {t("employer.candidateFilters.language")}
          </Label>
          <select
            id="language"
            name="language"
            defaultValue={searchParams.get("language") ?? ""}
            className={selectClassName}
          >
            <option value="">
              {t("employer.candidateFilters.anyLanguage")}
            </option>
            {CANDIDATE_SEARCH_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#0F172A]">
            <input
              type="checkbox"
              id="hasCv"
              name="hasCv"
              defaultChecked={searchParams.get("hasCv") === "1"}
              className="size-4 rounded border-input"
            />
            {t("employer.candidateFilters.cvOnly")}
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button type="submit" disabled={pending} variant="brand">
          {pending
            ? t("employer.candidateFilters.searching")
            : t("employer.candidateFilters.search")}
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          {t("employer.candidateFilters.clear")}
        </Button>
      </div>
    </form>
  );
}
