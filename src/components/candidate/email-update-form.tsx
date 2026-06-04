"use client";

import { useActionState } from "react";
import {
  updateAccountEmail,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AccountActionResult = {};

type EmailUpdateFormProps = {
  email: string | null;
};

export function EmailUpdateForm({ email }: EmailUpdateFormProps) {
  const [state, action, pending] = useActionState(updateAccountEmail, initial);

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
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={email ?? ""}
          required
          disabled={pending}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          Changing your email may require confirmation via a link we send to the
          new address.
        </p>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? "Saving…" : "Update email"}
      </Button>
    </form>
  );
}
