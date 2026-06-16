"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import {
  completePasswordReset,
  type AuthActionState,
} from "@/app/(auth)/actions";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";
import { evaluatePasswordStrength } from "@/lib/auth/password-strength";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const initial: AuthActionState = {};

export function ResetPasswordForm() {
  const { messages, t } = useI18n();
  const a = messages.account;
  const [state, action, pending] = useActionState(completePasswordReset, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const strength = useMemo(
    () => evaluatePasswordStrength(password),
    [password]
  );

  const passwordsMatch =
    confirm.length > 0 && password.length > 0 && password === confirm;
  const canSubmit = strength.meetsMinimum && passwordsMatch && !pending;

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="newPassword">{a.newPassword}</Label>
        <PasswordInput
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          required
          disabled={pending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrengthMeter password={password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{a.confirmPassword}</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
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
            {passwordsMatch ? a.passwordsMatch : a.passwordsNoMatch}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!canSubmit}
        className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? t("auth.resetPasswordUpdating") : t("auth.resetPasswordSubmit")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={siteConfig.links.login}
          className="font-medium text-[#2563EB] hover:underline"
        >
          {t("auth.backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
