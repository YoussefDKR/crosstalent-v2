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
import { statusLabel } from "@/lib/jobs/labels";
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
  const currentStatus = job?.status ?? "draft";

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
          Current state:{" "}
          <span className="font-medium text-[#0F172A]">
            {statusLabel(job.status)}
          </span>
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

      <div className="rounded-xl border border-border/80 bg-slate-50/80 p-5">
        <p className="text-sm font-medium text-[#0F172A]">What should we do?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {mode === "create"
            ? "Save as draft to finish later, or post to publish on the job board."
            : currentStatus === "draft"
              ? "Save your edits, post to go live, or keep as draft."
              : currentStatus === "published"
                ? "Save changes, close hiring, or move back to draft."
                : "Save changes or reopen the job on the board."}
        </p>

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
                {pending ? "Saving…" : "Save as draft"}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
                variant="brand"
                className="min-w-[140px]"
              >
                {pending ? "Posting…" : "Post job"}
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
                {pending ? "Saving…" : "Save as draft"}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
                className="bg-[#10B981] text-white hover:bg-[#059669]"
              >
                {pending ? "Posting…" : "Post job"}
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
                {pending ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
              >
                Move to draft
              </Button>
              <Button
                type="submit"
                name="intent"
                value="close"
                variant="outline"
                disabled={pending}
              >
                Mark as closed
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
                {pending ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="submit"
                name="intent"
                value="reopen"
                disabled={pending}
                variant="brand"
              >
                Reopen & post
              </Button>
              <Button
                type="submit"
                name="intent"
                value="draft"
                variant="outline"
                disabled={pending}
              >
                Move to draft
              </Button>
            </>
          )}
        </div>

        {mode === "create" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Drafts are only visible to you. Posted jobs appear on{" "}
            <Link href="/jobs" className="font-medium text-[#2563EB] hover:underline">
              /jobs
            </Link>
            .
          </p>
        )}
      </div>
    </form>
  );
}
