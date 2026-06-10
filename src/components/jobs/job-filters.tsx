"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  COMMON_JOB_SKILLS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATION_COUNTRIES,
  REMOTE_TYPES,
} from "@/config/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type JobFiltersProps = {
  basePath?: string;
};

export function JobFilters({ basePath = "/jobs" }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const { t } = useI18n();

  const apply = useCallback(
    (form: HTMLFormElement) => {
      const data = new FormData(form);
      const params = new URLSearchParams();

      for (const [key, value] of data.entries()) {
        const v = String(value).trim();
        if (v) params.set(key, v);
      }

      const query = params.toString();
      const href = query ? `${basePath}?${query}` : basePath;

      startTransition(() => {
        router.push(href);
      });
    },
    [router, basePath]
  );

  function clearFilters() {
    startTransition(() => router.push(basePath));
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
        {t("jobs.filterJobs")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="q">{t("jobs.searchLabel")}</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="q"
              name="q"
              placeholder={t("jobs.roleCompanyKeywords")}
              defaultValue={searchParams.get("q") ?? ""}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{t("jobs.country")}</Label>
          <select
            id="country"
            name="country"
            defaultValue={searchParams.get("country") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("jobs.allCountries")}</option>
            {JOB_LOCATION_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remoteType">{t("jobs.workStyle")}</Label>
          <select
            id="remoteType"
            name="remoteType"
            defaultValue={searchParams.get("remoteType") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("jobs.any")}</option>
            {REMOTE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">{t("jobs.employment")}</Label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={searchParams.get("employmentType") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("jobs.any")}</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel">{t("jobs.experience")}</Label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            defaultValue={searchParams.get("experienceLevel") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("jobs.anyLevel")}</option>
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill">{t("jobs.skill")}</Label>
          <select
            id="skill"
            name="skill"
            defaultValue={searchParams.get("skill") ?? ""}
            className={selectClassName}
          >
            <option value="">{t("jobs.anySkill")}</option>
            {COMMON_JOB_SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryMin">{t("jobs.minSalary")}</Label>
          <Input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min={0}
            step={1000}
            placeholder={t("jobs.salaryPlaceholder")}
            defaultValue={searchParams.get("salaryMin") ?? ""}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          type="submit"
          disabled={pending}
          className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          {pending ? t("jobs.applying") : t("jobs.applyFilters")}
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          {t("jobs.clear")}
        </Button>
      </div>
    </form>
  );
}
