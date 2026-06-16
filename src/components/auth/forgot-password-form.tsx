"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordReset,
  type AuthActionState,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

const initial: AuthActionState = {};

type ForgotPasswordFormProps = {
  initialError?: string;
};

export function ForgotPasswordForm({ initialError }: ForgotPasswordFormProps) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(requestPasswordReset, initial);

  const displayError = state.error ?? initialError;

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        {t("auth.forgotPasswordGoogleHint")}
      </p>

      <form action={action} className="space-y-5">
        {displayError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {displayError}
          </div>
        )}

        {state.success && (
          <div
            role="status"
            className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 text-sm text-[#047857]"
          >
            {state.success}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            required
            disabled={pending || !!state.success}
          />
        </div>

        <Button
          type="submit"
          disabled={pending || !!state.success}
          className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          {pending
            ? t("auth.forgotPasswordSending")
            : t("auth.forgotPasswordSend")}
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
    </div>
  );
}
