"use client";

import { useActionState } from "react";
import {
  requestAccountDeletion,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const initial: AccountActionResult = {};

type DeleteAccountSectionProps = {
  email: string | null;
};

export function DeleteAccountSection({ email }: DeleteAccountSectionProps) {
  const [state, action, pending] = useActionState(
    requestAccountDeletion,
    initial
  );
  const { messages } = useI18n();
  const a = messages.account;

  return (
    <form action={action} className="space-y-5">
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

      <p className="text-sm text-muted-foreground">{a.deleteWarning}</p>

      <div className="space-y-2">
        <Label htmlFor="deleteAccountEmail">{a.confirmEmail}</Label>
        <Input
          id="deleteAccountEmail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={email ?? "you@example.com"}
          required
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">{a.confirmEmailHint}</p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        {pending ? a.sendingConfirmation : a.deletionLinkBtn}
      </Button>
    </form>
  );
}
