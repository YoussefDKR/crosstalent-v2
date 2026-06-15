"use client";

import { useActionState } from "react";
import {
  updateAccountEmail,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const initial: AccountActionResult = {};

type EmailUpdateFormProps = {
  email: string | null;
};

export function EmailUpdateForm({ email }: EmailUpdateFormProps) {
  const [state, action, pending] = useActionState(updateAccountEmail, initial);
  const { messages } = useI18n();
  const a = messages.account;

  return (
    <form key={email ?? "email"} action={action} className="space-y-4">
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
        <Label htmlFor="email">{a.emailAddress}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email ?? ""}
          required
          disabled={pending}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">{a.emailConfirmNote}</p>
      </div>
      <Button
        type="submit"
        disabled={pending}
        variant="brand"
      >
        {pending ? a.saving : a.updateEmail}
      </Button>
    </form>
  );
}
