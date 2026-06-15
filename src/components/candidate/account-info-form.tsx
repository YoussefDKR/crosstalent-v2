"use client";

import { useActionState } from "react";
import {
  updateAccountName,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";

const initial: AccountActionResult = {};

type AccountInfoFormProps = {
  fullName: string | null;
};

export function AccountInfoForm({ fullName }: AccountInfoFormProps) {
  const [state, action, pending] = useActionState(updateAccountName, initial);
  const { messages } = useI18n();
  const a = messages.account;

  return (
    <form key={fullName ?? "account"} action={action} className="space-y-4">
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
        <Label htmlFor="fullName">{a.fullName}</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          required
          disabled={pending}
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        variant="brand"
      >
        {pending ? a.saving : a.saveName}
      </Button>
    </form>
  );
}
