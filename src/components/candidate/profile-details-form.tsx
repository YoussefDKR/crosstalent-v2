"use client";

import { useActionState, useState } from "react";
import {
  updateCandidateDetails,
  type ActionResult,
} from "@/app/candidate/actions";
import { BIO_MIN_LENGTH, MENA_COUNTRIES } from "@/config/candidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CandidateProfileRow } from "@/types/candidate";

const initial: ActionResult = {};

type ProfileDetailsFormProps = {
  details: CandidateProfileRow | null;
};

export function ProfileDetailsForm({ details }: ProfileDetailsFormProps) {
  const [state, action, pending] = useActionState(
    updateCandidateDetails,
    initial
  );
  const [bioLength, setBioLength] = useState(
    (details?.bio ?? "").trim().length
  );
  const bioComplete = bioLength >= BIO_MIN_LENGTH;

  return (
    <form
      key={details?.updated_at ?? "new"}
      action={action}
      className="space-y-4"
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
        <Label htmlFor="headline">Professional headline</Label>
        <Input
          id="headline"
          name="headline"
          placeholder="e.g. Senior React Developer · Open to EU roles"
          defaultValue={details?.headline ?? ""}
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About you</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Tell employers about your experience, strengths, and what you're looking for…"
          defaultValue={details?.bio ?? ""}
          disabled={pending}
          onChange={(e) => setBioLength(e.target.value.trim().length)}
        />
        <p
          className={cn(
            "text-xs",
            bioComplete ? "text-[#10B981]" : "text-muted-foreground"
          )}
        >
          {bioLength}/{BIO_MIN_LENGTH} characters
          {bioComplete
            ? " — counts toward profile strength"
            : ` — write at least ${BIO_MIN_LENGTH - bioLength} more for the dashboard checkmark`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">City / region</Label>
          <Input
            id="location"
            name="location"
            placeholder="Casablanca, Tunis, Cairo…"
            defaultValue={details?.location ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="countryCode">Country</Label>
          <select
            id="countryCode"
            name="countryCode"
            defaultValue={details?.country_code ?? ""}
            disabled={pending}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select country</option>
            {MENA_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={details?.phone ?? ""}
          disabled={pending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/…"
            defaultValue={details?.linkedin_url ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio</Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            placeholder="https://…"
            defaultValue={details?.portfolio_url ?? ""}
            disabled={pending}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        variant="brand"
      >
        {pending ? "Saving…" : "Save profile details"}
      </Button>
    </form>
  );
}
