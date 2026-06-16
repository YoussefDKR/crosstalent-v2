"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  confirmPasswordRecovery,
  type AuthActionState,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

const initial: AuthActionState = {};

type RecoverPasswordConfirmFormProps = {
  tokenHash: string;
};

export function RecoverPasswordConfirmForm({
  tokenHash,
}: RecoverPasswordConfirmFormProps) {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(
    confirmPasswordRecovery,
    initial
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token_hash" value={tokenHash} />

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? t("auth.recoverContinuing") : t("auth.recoverContinue")}
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
