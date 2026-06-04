"use client";

import { useActionState, useMemo, useState } from "react";
import {
  updateAccountPassword,
  type AccountActionResult,
} from "@/lib/auth/account-actions";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evaluatePasswordStrength } from "@/lib/auth/password-strength";
import { cn } from "@/lib/utils";

const initial: AccountActionResult = {};

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(updateAccountPassword, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const strength = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  const passwordsMatch =
    confirm.length > 0 && password.length > 0 && password === confirm;
  const canSubmit =
    strength.meetsMinimum && passwordsMatch && !pending;

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

      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthMeter password={password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={confirm.length > 0 && !passwordsMatch}
        />
        {confirm.length > 0 && (
          <p
            className={cn(
              "text-xs",
              passwordsMatch ? "text-emerald-600" : "text-red-600"
            )}
          >
            {passwordsMatch
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        If you signed up with a magic link only, set a password here to sign in
        with email next time.
      </p>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="bg-[#2563EB] text-white hover:bg-[#1d4ed8] disabled:opacity-50"
      >
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
