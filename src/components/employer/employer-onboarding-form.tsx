"use client";

import { useActionState } from "react";
import {
  completeEmployerOnboarding,
  type EmployerOnboardingResult,
} from "@/app/employer/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: EmployerOnboardingResult = {};

export function EmployerOnboardingForm() {
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
        <Label htmlFor="companyName">Company name *</Label>
        <Input
          id="companyName"
          name="companyName"
          placeholder="e.g. NordScale GmbH"
          required
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Company website *</Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://yourcompany.com"
          required
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          Your public company website. Candidates may visit this link.
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        variant="brand"
        className="h-10 w-full"
      >
        {pending ? "Saving…" : "Continue to dashboard"}
      </Button>
    </form>
  );
}
