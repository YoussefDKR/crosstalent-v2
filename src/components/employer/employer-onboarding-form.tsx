"use client";

import { useActionState } from "react";
import {
  completeEmployerOnboarding,
  type EmployerOnboardingResult,
} from "@/app/employer/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const initial: EmployerOnboardingResult = {};

export function EmployerOnboardingForm() {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(
    completeEmployerOnboarding,
    initial
  );

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {state.error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="companyName">
          {t("employer.onboardingForm.companyName")}
        </Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder={t("employer.onboardingForm.companyNamePlaceholder")}
          required
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">{t("employer.onboardingForm.website")}</Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder={t("employer.onboardingForm.websitePlaceholder")}
          required
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          {t("employer.onboardingForm.websiteHint")}
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        variant="brand"
        className="h-10 w-full"
      >
        {pending
          ? t("employer.onboardingForm.saving")
          : t("employer.onboardingForm.continue")}
      </Button>
    </form>
  );
}
