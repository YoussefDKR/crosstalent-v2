"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";
import {
  COMMON_JOB_SKILLS,
  EMPLOYMENT_TYPES,
  JOB_LOCATION_COUNTRIES,
} from "@/config/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n-provider";

const selectClassName =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20";

const POPULAR_TAGS = [
  "Customer Support",
  "Sales",
  "Marketing",
  "IT & Development",
  "Data",
  "Finance",
] as const;

type JobBoardSearchProps = {
  basePath?: string;
};

export function JobBoardSearch({ basePath = "/jobs" }: JobBoardSearchProps) {
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
      startTransition(() => {
        router.push(query ? `${basePath}?${query}` : basePath);
      });
    },
    [router, basePath]
  );

  function setQuickTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", tag);
    startTransition(() => {
      router.push(`${basePath}?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-white p-4 shadow-sm lg:flex-row lg:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          apply(e.currentTarget);
        }}
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
            {t("jobs.keywords")}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="q"
              name="q"
              placeholder={t("jobs.jobTitleKeywords")}
              defaultValue={searchParams.get("q") ?? ""}
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[55%]">
          <div className="space-y-1.5">
            <label htmlFor="country" className="text-xs font-medium text-muted-foreground">
              {t("jobs.location")}
            </label>
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

          <div className="space-y-1.5">
            <label htmlFor="skill" className="text-xs font-medium text-muted-foreground">
              {t("jobs.category")}
            </label>
            <select
              id="skill"
              name="skill"
              defaultValue={searchParams.get("skill") ?? ""}
              className={selectClassName}
            >
              <option value="">{t("jobs.allCategories")}</option>
              {COMMON_JOB_SKILLS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="employmentType"
              className="text-xs font-medium text-muted-foreground"
            >
              {t("jobs.jobType")}
            </label>
            <select
              id="employmentType"
              name="employmentType"
              defaultValue={searchParams.get("employmentType") ?? ""}
              className={selectClassName}
            >
              <option value="">{t("jobs.allJobTypes")}</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="h-11 shrink-0 bg-[#2563EB] px-8 text-white hover:bg-[#1d4ed8] lg:mb-0"
        >
          {pending ? t("jobs.searching") : t("jobs.search")}
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("jobs.popular")}</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuickTag(tag)}
            className="rounded-full border border-border bg-white px-3 py-1 text-sm text-[#0F172A]/80 transition-colors hover:border-[#2563EB]/40 hover:text-[#2563EB]"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
