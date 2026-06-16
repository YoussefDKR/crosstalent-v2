"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getPostLoginPath,
  signInWithEmail,
} from "@/lib/auth/client-auth";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";

type LoginFormProps = {
  redirectTo?: string;
  authError?: string;
};

export function LoginForm({ redirectTo, authError }: LoginFormProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(authError ?? null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signInWithEmail(email, password);

    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }

    const path = getPostLoginPath(result.role, redirectTo);
    window.location.href = path;
  }

  return (
    <div className="space-y-5">
      <GoogleSignInButton
        label={t("auth.signInWithGoogle")}
        redirectTo={redirectTo}
        disabled={pending}
        onError={setError}
      />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            minLength={8}
            disabled={pending}
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          {pending ? t("auth.signingIn") : t("common.signIn")}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link
            href={siteConfig.links.signup}
            className="font-medium text-[#2563EB] hover:underline"
          >
            {t("common.createOne")}
          </Link>
        </p>
      </form>
    </div>
  );
}
