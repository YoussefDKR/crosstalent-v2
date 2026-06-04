"use client";

import { useActionState, useState } from "react";
import {
  updateCompanyProfile,
  type EmployerActionResult,
} from "@/app/employer/actions";
import {
  COMPANY_DESCRIPTION_MIN_LENGTH,
  COMPANY_SIZES,
  EU_HQ_COUNTRIES,
  HIRING_REGIONS,
  INDUSTRIES,
} from "@/config/employer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/shared/image-upload";
import type { CompanyProfileRow } from "@/types/employer";

const initial: EmployerActionResult = {};

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type CompanyProfileFormProps = {
  company: CompanyProfileRow | null;
};

export function CompanyProfileForm({ company }: CompanyProfileFormProps) {
  const [state, action, pending] = useActionState(
    updateCompanyProfile,
    initial
  );
  const [descLength, setDescLength] = useState(
    (company?.description ?? "").trim().length
  );
  const descComplete = descLength >= COMPANY_DESCRIPTION_MIN_LENGTH;

  return (
    <form
      key={company?.updated_at ?? "new"}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="companyName">Company name *</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="e.g. NordScale GmbH"
            defaultValue={company?.company_name ?? ""}
            required
            disabled={pending}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            placeholder="e.g. Building European teams with MENA talent"
            defaultValue={company?.tagline ?? ""}
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">About the company</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe your mission, culture, and why candidates should join…"
          defaultValue={company?.description ?? ""}
          disabled={pending}
          onChange={(e) => setDescLength(e.target.value.trim().length)}
        />
        <p
          className={cn(
            "text-xs",
            descComplete ? "text-[#10B981]" : "text-muted-foreground"
          )}
        >
          {descLength}/{COMPANY_DESCRIPTION_MIN_LENGTH} characters
          {descComplete
            ? " — counts toward profile strength"
            : ` — ${COMPANY_DESCRIPTION_MIN_LENGTH - descLength} more needed for checkmark`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            name="industry"
            defaultValue={company?.industry ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companySize">Company size</Label>
          <select
            id="companySize"
            name="companySize"
            defaultValue={company?.company_size ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">Select size</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="headquartersCity">HQ city</Label>
          <Input
            id="headquartersCity"
            name="headquartersCity"
            placeholder="Berlin, Paris, Madrid…"
            defaultValue={company?.headquarters_city ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headquartersCountry">HQ country</Label>
          <select
            id="headquartersCountry"
            name="headquartersCountry"
            defaultValue={company?.headquarters_country ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">Select country</option>
            {EU_HQ_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hiringInRegions">Hiring talent from</Label>
        <select
          id="hiringInRegions"
          name="hiringInRegions"
          defaultValue={company?.hiring_in_regions ?? ""}
          disabled={pending}
          className={selectClassName}
        >
          <option value="">Select primary region</option>
          {HIRING_REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://yourcompany.com"
            defaultValue={company?.website ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/company/…"
            defaultValue={company?.linkedin_url ?? ""}
            disabled={pending}
          />
        </div>
      </div>

      <ImageUpload
        kind="logo"
        uploadUrl="/api/upload/company-logo"
        pathOrUrl={company?.logo_url ?? null}
        displayName={company?.company_name}
        label="Company logo"
        hint="Square or wide logo works best · Compressed to WebP on upload"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="hiring@company.com"
            defaultValue={company?.contact_email ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            defaultValue={company?.contact_phone ?? ""}
            disabled={pending}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? "Saving…" : "Save company profile"}
      </Button>
    </form>
  );
}
