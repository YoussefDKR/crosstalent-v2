"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createJob,
  updateJob,
  type JobActionResult,
} from "@/app/employer/jobs/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/i18n-provider";
import type { JobRow, JobStatus } from "@/types/jobs";

const initial: JobActionResult = {};

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type JobFormProps = {
  job?: JobRow | null;
  mode: "create" | "edit";
};

export function JobForm({ job, mode }: JobFormProps) {
  const { t } = useI18n();
  const action =
    mode === "create" ? createJob : updateJob.bind(null, job!.id);

  const [state, formAction, pending] = useActionState(action, initial);

  const skillsValue = job?.skills?.join(", ") ?? "";
  const languagesValue = job?.languages?.join(", ") ?? "";
  const currentStatus = job?.status ?? "draft";

  const intentHint =
    mode === "create"
      ? t("employer.jobForm.hintCreate")
      : currentStatus === "draft"
        ? t("employer.jobForm.hintEditDraft")
        : currentStatus === "published"
          ? t("employer.jobForm.hintEditPublished")
          : t("employer.jobForm.hintEditClosed");

  return (
    <form
      key={job?.updated_at ?? "new"}
      action={formAction}
      className="space-y-6"
    >
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

      {mode === "edit" && job && (
        <p className="rounded-lg border border-border/80 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
          {t("employer.jobForm.currentState")}{" "}
          <span className="font-medium text-[#0F172A]">
            {t(`employer.jobStatuses.${job.status as JobStatus}`)}
          </span>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">{t("employer.jobForm.jobTitleRequired")}</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder={t("employer.jobForm.jobTitlePlaceholder")}
          defaultValue={job?.title ?? ""}
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t("employer.jobForm.descriptionRequired")}
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          required
          placeholder={t("employer.jobForm.descriptionPlaceholder")}
          defaultValue={job?.description ?? ""}
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">
          {t("employer.jobForm.requirements")}
        </Label>
        <Textarea
          id="requirements"
          name="requirements"
          rows={4}
          placeholder={t("employer.jobForm.requirementsPlaceholder")}
          defaultValue={job?.requirements ?? ""}
          disabled={pending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="employmentType">
            {t("employer.jobForm.employmentType")}
          </Label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={job?.employment_type ?? "full_time"}
            className={selectClassName}
            disabled={pending}
          >
            {EMPLOYMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(`employer.employmentTypes.${item.value}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="remoteType">{t("employer.jobForm.workStyle")}</Label>
          <select
            id="remoteType"
            name="remoteType"
            defaultValue={job?.remote_type ?? "hybrid"}
            className={selectClassName}
            disabled={pending}
          >
            {REMOTE_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(`employer.remoteTypes.${item.value}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">
            {t("employer.jobForm.experience")}
          </Label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            defaultValue={job?.experience_level ?? "mid"}
            className={selectClassName}
            disabled={pending}
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {t(`employer.experienceLevels.${level.value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="locationCity">{t("employer.jobForm.city")}</Label>
          <Input
            id="locationCity"
            name="locationCity"
            placeholder={t("employer.jobForm.cityPlaceholder")}
            defaultValue={job?.location_city ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationCountry">
            {t("employer.jobForm.country")}
          </Label>
          <select
            id="locationCountry"
            name="locationCountry"
            defaultValue={job?.location_country ?? ""}
            className={selectClassName}
            disabled={pending}
          >
            <option value="">{t("employer.jobForm.select")}</option>
            {JOB_LOCATION_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {t(`employer.jobCountries.${c.code}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">{t("employer.jobForm.salaryMin")}</Label>
          <Input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min={0}
            defaultValue={job?.salary_min ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">{t("employer.jobForm.salaryMax")}</Label>
          <Input
            id="salaryMax"
            name="salaryMax"
            type="number"
            min={0}
            defaultValue={job?.salary_max ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryCurrency">
            {t("employer.jobForm.currency")}
          </Label>
          <Input
            id="salaryCurrency"
            name="salaryCurrency"
            defaultValue={job?.salary_currency ?? "EUR"}
            disabled={pending}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="skills">{t("employer.jobForm.skills")}</Label>
          <Input
            id="skills"
            name="skills"
            placeholder={t("employer.jobForm.skillsPlaceholder")}
            defaultValue={skillsValue}
            disabled={pending}
            list="skill-suggestions"
          />
          <datalist id="skill-suggestions">
            {COMMON_JOB_SKILLS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">{t("employer.jobForm.languages")}</Label>
          <Input
            id="languages"
            name="languages"
            placeholder={t("employer.jobForm.languagesPlaceholder")}
            defaultValue={languagesValue}
            disabled={pending}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-slate-50/80 p-5">
        <p className="text-sm font-medium text-[#0F172A]">
          {t("employer.jobForm.whatShouldWeDo")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{intentHint}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          {mode === "create" && (
            <>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
                className="min-w-[140px]"
              >
                {pending
                  ? t("employer.jobForm.saving")
                  : t("employer.jobForm.saveAsDraft")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
                variant="brand"
                className="min-w-[140px]"
              >
                {pending
                  ? t("employer.jobForm.posting")
                  : t("employer.jobForm.postJob")}
              </Button>
            </>
          )}

          {mode === "edit" && currentStatus === "draft" && (
            <>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
              >
                {pending
                  ? t("employer.jobForm.saving")
                  : t("employer.jobForm.saveAsDraft")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
                className="bg-[#10B981] text-white hover:bg-[#059669]"
              >
                {pending
                  ? t("employer.jobForm.posting")
                  : t("employer.jobForm.postJob")}
              </Button>
            </>
          )}

          {mode === "edit" && currentStatus === "published" && (
            <>
              <Button
                type="submit"
                name="intent"
                value="save"
                disabled={pending}
                variant="brand"
              >
                {pending
                  ? t("employer.jobForm.saving")
                  : t("employer.jobForm.saveChanges")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
              >
                {t("employer.jobForm.moveToDraft")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="close"
                variant="outline"
                disabled={pending}
              >
                {t("employer.jobForm.markClosed")}
              </Button>
            </>
          )}

          {mode === "edit" && currentStatus === "closed" && (
            <>
              <Button
                type="submit"
                name="intent"
                value="save"
                variant="outline"
                disabled={pending}
              >
                {pending
                  ? t("employer.jobForm.saving")
                  : t("employer.jobForm.saveChanges")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="reopen"
                disabled={pending}
                variant="brand"
              >
                {t("employer.jobForm.reopenPost")}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
              >
                {t("employer.jobForm.moveToDraft")}
              </Button>
            </>
          )}
        </div>

        {mode === "create" && (
          <p className="mt-3 text-xs text-muted-foreground">
            {t("employer.jobForm.draftsHintBefore")}{" "}
            <Link
              href="/jobs"
              className="font-medium text-[#2563EB] hover:underline"
            >
              /jobs
            </Link>
            {t("employer.jobForm.draftsHintAfter")}
          </p>
        )}
      </div>
    </form>
  );
}
