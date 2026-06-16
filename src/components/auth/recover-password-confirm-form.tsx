"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/client";

type RecoverPasswordConfirmFormProps = {
  tokenHash: string;
};

export function RecoverPasswordConfirmForm({
  tokenHash,
}: RecoverPasswordConfirmFormProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleContinue() {
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    });

    if (verifyError) {
      setError(t("auth.resetPasswordSessionExpired"));
      setPending(false);
      return;
    }

    window.location.href = AUTH_ROUTES.resetPassword;
  }

  return (
    <div className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <Button
        type="button"
        disabled={pending}
        onClick={handleContinue}
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
    </div>
  );
}
