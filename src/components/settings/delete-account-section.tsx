"use client";

import { useActionState } from "react";
import {
  requestAccountDeletion,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AccountActionResult = {};

type DeleteAccountSectionProps = {
  email: string | null;
};

export function DeleteAccountSection({ email }: DeleteAccountSectionProps) {
  const [state, action, pending] = useActionState(
    requestAccountDeletion,
    initial
  );

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

      <p className="text-sm text-muted-foreground">
        Permanently delete your account and all associated data. This cannot be
        undone. We&apos;ll email you a confirmation link — your account stays
        active until you open it.
      </p>

      <div className="space-y-2">
        <Label htmlFor="deleteAccountEmail">Confirm your email</Label>
        <Input
          id="deleteAccountEmail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={email ?? "you@example.com"}
          required
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          Type the email address on your account to request deletion.
        </p>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-red-600 text-white hover:bg-red-700"
      >
        {pending ? "Sending confirmation…" : "Email me a deletion link"}
      </Button>
    </form>
  );
}
