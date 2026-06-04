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
  JOB_STATUSES,
  REMOTE_TYPES,
} from "@/config/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { JobRow } from "@/types/jobs";

const initial: JobActionResult = {};

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type JobFormProps = {
  job?: JobRow | null;
  mode: "create" | "edit";
};

export function JobForm({ job, mode }: JobFormProps) {
  const action =
    mode === "create"
      ? createJob
      : updateJob.bind(null, job!.id);

  const [state, formAction, pending] = useActionState(action, initial);

  const skillsValue = job?.skills?.join(", ") ?? "";
  const languagesValue = job?.languages?.join(", ") ?? "";

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

      <div className="space-y-2">
        <Label htmlFor="title">Job title *</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. Senior React Developer"
          defaultValue={job?.title ?? ""}
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          rows={6}
          required
          placeholder="Role overview, team, impact…"
          defaultValue={job?.description ?? ""}
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          rows={4}
          placeholder="Must-have skills, years of experience…"
          defaultValue={job?.requirements ?? ""}
          disabled={pending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment type</Label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={job?.employment_type ?? "full_time"}
            className={selectClassName}
            disabled={pending}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="remoteType">Work style</Label>
          <select
            id="remoteType"
            name="remoteType"
            defaultValue={job?.remote_type ?? "hybrid"}
            className={selectClassName}
            disabled={pending}
          >
            {REMOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Experience</Label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            defaultValue={job?.experience_level ?? "mid"}
            className={selectClassName}
            disabled={pending}
          >
            {EXPERIENCE_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="locationCity">City</Label>
          <Input
            id="locationCity"
            name="locationCity"
            placeholder="Paris, Berlin…"
            defaultValue={job?.location_city ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationCountry">Country</Label>
          <select
            id="locationCountry"
            name="locationCountry"
            defaultValue={job?.location_country ?? ""}
            className={selectClassName}
            disabled={pending}
          >
            <option value="">Select</option>
            {JOB_LOCATION_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Salary min (EUR)</Label>
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
          <Label htmlFor="salaryMax">Salary max (EUR)</Label>
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
          <Label htmlFor="salaryCurrency">Currency</Label>
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
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input
            id="skills"
            name="skills"
            placeholder="React, TypeScript, Node.js"
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
          <Label htmlFor="languages">Languages (comma-separated)</Label>
          <Input
            id="languages"
            name="languages"
            placeholder="English, French, Arabic"
            defaultValue={languagesValue}
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={job?.status ?? "draft"}
          className={selectClassName}
          disabled={pending}
        >
          {JOB_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>Draft</strong> jobs are only visible to you. Choose{" "}
          <strong>Published</strong> and click Save (or use Publish on the list)
          so candidates see this role on{" "}
          <Link href="/jobs" className="font-medium underline">
            /jobs
          </Link>
          .
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create job"
            : "Save job"}
      </Button>
    </form>
  );
}
