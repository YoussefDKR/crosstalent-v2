"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUp, type AuthActionState } from "@/app/(auth)/actions";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordInput } from "@/components/auth/password-input";
import { RoleSelector } from "@/components/auth/role-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/context/i18n-provider";
import { siteConfig } from "@/config/site";
import type { UserRole } from "@/types";

const initialState: AuthActionState = {};

type SignupFormProps = {
  defaultRole?: UserRole;
};

export function SignupForm({ defaultRole = "candidate" }: SignupFormProps) {
  const { t } = useI18n();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(signUp, initialState);

  const displayError = oauthError ?? state.error;
  const formDisabled = pending || !!state.success;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>{t("auth.signingUpAs")}</Label>
        <RoleSelector
          value={role}
          onChange={setRole}
          disabled={formDisabled}
        />
      </div>

      <GoogleSignInButton
        label={t("auth.signUpWithGoogle")}
        signupRole={role}
        disabled={formDisabled}
        onError={setOauthError}
      />

      <AuthDivider />

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="role" value={role} />

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

        {role === "employer" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">{t("auth.companyName")}</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder={t("auth.companyNamePlaceholder")}
                required
                disabled={pending || !!state.success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">{t("auth.companyWebsite")}</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder={t("auth.companyWebsitePlaceholder")}
                required
                disabled={pending || !!state.success}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">{t("auth.fullName")}</Label>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Your full name"
            required
            disabled={pending || !!state.success}
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            disabled={pending || !!state.success}
          />
        </div>

        <Button
          type="submit"
          disabled={pending || !!state.success}
          className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
        >
          {pending ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          {t("auth.termsNotice")}
        </p>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link
            href={siteConfig.links.login}
            className="font-medium text-[#2563EB] hover:underline"
          >
            {t("common.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}
