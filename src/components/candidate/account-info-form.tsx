"use client";

import { useActionState } from "react";
import {
  updateAccountInfo,
  type ActionResult,
} from "@/app/candidate/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: ActionResult = {};

type AccountInfoFormProps = {
  fullName: string | null;
  email: string | null;
};

export function AccountInfoForm({ fullName, email }: AccountInfoFormProps) {
  const [state, action, pending] = useActionState(updateAccountInfo, initial);

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
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          required
          disabled={pending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email ?? ""} disabled className="bg-muted" />
        <p className="text-xs text-muted-foreground">
          Email is managed through your account settings.
        </p>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? "Saving…" : "Save account"}
      </Button>
    </form>
  );
}
