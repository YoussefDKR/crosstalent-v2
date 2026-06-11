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
import { useI18n } from "@/context/i18n-provider";
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
  const { messages, t } = useI18n();
  const f = messages.employer.companyForm;
  const sizes = messages.employer.companySizes;
  const industries = messages.employer.industries;
  const countries = messages.employer.hqCountries;
  const regions = messages.employer.hiringRegions;

  const [state, action, pending] = useActionState(
    updateCompanyProfile,
    initial
  );
  const [descLength, setDescLength] = useState(
    (company?.description ?? "").trim().length
  );
  const descComplete = descLength >= COMPANY_DESCRIPTION_MIN_LENGTH;

  const charHint = t("employer.companyForm.charCount", {
    current: descLength,
    min: COMPANY_DESCRIPTION_MIN_LENGTH,
  });

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
          <Label htmlFor="companyName">
            {f.companyName} *
          </Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder={f.companyNamePlaceholder}
            defaultValue={company?.company_name ?? ""}
            required
            disabled={pending}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="tagline">{f.tagline}</Label>
          <Input
            id="tagline"
            name="tagline"
            placeholder={f.taglinePlaceholder}
            defaultValue={company?.tagline ?? ""}
            disabled={pending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{f.about}</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          placeholder={f.aboutPlaceholder}
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
          {charHint}
          {descComplete
            ? f.charCountsToward
            : t("employer.companyForm.charMoreNeeded", {
                remaining: COMPANY_DESCRIPTION_MIN_LENGTH - descLength,
              })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">{f.industry}</Label>
          <select
            id="industry"
            name="industry"
            defaultValue={company?.industry ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">{f.selectIndustry}</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {industries[ind as keyof typeof industries] ?? ind}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companySize">{f.companySize}</Label>
          <select
            id="companySize"
            name="companySize"
            defaultValue={company?.company_size ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">{f.selectSize}</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s.value} value={s.value}>
                {sizes[s.value as keyof typeof sizes] ?? s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="headquartersCity">{f.hqCity}</Label>
          <Input
            id="headquartersCity"
            name="headquartersCity"
            placeholder={f.hqCityPlaceholder}
            defaultValue={company?.headquarters_city ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headquartersCountry">{f.hqCountry}</Label>
          <select
            id="headquartersCountry"
            name="headquartersCountry"
            defaultValue={company?.headquarters_country ?? ""}
            disabled={pending}
            className={selectClassName}
          >
            <option value="">{f.selectCountry}</option>
            {EU_HQ_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {countries[c.code as keyof typeof countries] ?? c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hiringInRegions">{f.hiringFrom}</Label>
        <select
          id="hiringInRegions"
          name="hiringInRegions"
          defaultValue={company?.hiring_in_regions ?? ""}
          disabled={pending}
          className={selectClassName}
        >
          <option value="">{f.selectRegion}</option>
          {HIRING_REGIONS.map((region) => (
            <option key={region} value={region}>
              {regions[region as keyof typeof regions] ?? region}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">{f.website}</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder={f.websitePlaceholder}
            defaultValue={company?.website ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">{f.linkedin}</Label>
          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            type="url"
            placeholder={f.linkedinPlaceholder}
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
        label={f.logo}
        hint={f.logoHint}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">{f.contactEmail}</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder={f.contactEmailPlaceholder}
            defaultValue={company?.contact_email ?? ""}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">{f.contactPhone}</Label>
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
        {pending ? f.saving : f.save}
      </Button>
    </form>
  );
}
