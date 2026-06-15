"use client";

import { useActionState } from "react";
import {
  COMMON_JOB_SKILLS,
  EMPLOYMENT_TYPES,
  JOB_LOCATION_COUNTRIES,
} from "@/config/jobs";
import { createJobAlert } from "@/app/candidate/job-board-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n-provider";

const selectClassName =
  "h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20";

type JobAlertFormProps = {
  defaultValues?: {
    name?: string;
    q?: string;
    country?: string;
    employmentType?: string;
    remoteType?: string;
    experienceLevel?: string;
    skill?: string;
    salaryMin?: string;
  };
};

export function JobAlertForm({ defaultValues }: JobAlertFormProps) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(createJobAlert, {});

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-border/80 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="alert-name" className="text-sm font-medium text-[#0F172A]">
          {t("jobs.alertName")}
        </label>
        <Input
          id="alert-name"
          name="name"
          className="mt-1.5"
          placeholder={t("jobs.alertNamePlaceholder")}
          defaultValue={defaultValues?.name ?? ""}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="alert-q" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.keywords")}
          </label>
          <Input
            id="alert-q"
            name="q"
            className="mt-1.5"
            placeholder={t("jobs.roleCompanyKeywords")}
            defaultValue={defaultValues?.q ?? ""}
          />
        </div>

        <div>
          <label htmlFor="alert-country" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.country")}
          </label>
          <select
            id="alert-country"
            name="country"
            className={`mt-1.5 ${selectClassName}`}
            defaultValue={defaultValues?.country ?? ""}
          >
            <option value="">{t("jobs.allCountries")}</option>
            {JOB_LOCATION_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="alert-remote" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.remoteType")}
          </label>
          <select
            id="alert-remote"
            name="remoteType"
            className={`mt-1.5 ${selectClassName}`}
            defaultValue={defaultValues?.remoteType ?? ""}
          >
            <option value="">{t("jobs.any")}</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div>
          <label htmlFor="alert-employment" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.employmentType")}
          </label>
          <select
            id="alert-employment"
            name="employmentType"
            className={`mt-1.5 ${selectClassName}`}
            defaultValue={defaultValues?.employmentType ?? ""}
          >
            <option value="">{t("jobs.allJobTypes")}</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="alert-skill" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.skill")}
          </label>
          <select
            id="alert-skill"
            name="skill"
            className={`mt-1.5 ${selectClassName}`}
            defaultValue={defaultValues?.skill ?? ""}
          >
            <option value="">{t("jobs.anySkill")}</option>
            {COMMON_JOB_SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="alert-salary" className="text-sm font-medium text-[#0F172A]">
            {t("jobs.minSalary")}
          </label>
          <Input
            id="alert-salary"
            name="salaryMin"
            type="number"
            min={0}
            className="mt-1.5"
            placeholder={t("jobs.salaryPlaceholder")}
            defaultValue={defaultValues?.salaryMin ?? ""}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-green-700">{state.success}</p>
      )}

      <Button type="submit" disabled={pending} variant="brand">
        {pending ? t("jobs.savingAlert") : t("jobs.createAlert")}
      </Button>
    </form>
  );
}
