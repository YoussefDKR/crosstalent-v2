import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthHashErrorHandler } from "@/components/auth/auth-hash-error-handler";
import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${siteConfig.name}`,
};

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo, error } = await searchParams;
  const { t } = await getServerI18n();

  const authError =
    error === "reset_link_expired"
      ? t("auth.resetPasswordSessionExpired")
      : error === "auth_callback_failed"
        ? t("auth.authCallbackFailed")
        : undefined;

  return (
    <AuthShell
      title={t("auth.welcomeBack")}
      subtitle={t("auth.loginSubtitleDashboard")}
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          {t("common.backToHome")}
        </Link>
      }
    >
      <AuthHashErrorHandler />
      <LoginForm redirectTo={redirectTo} authError={authError} />
    </AuthShell>
  );
}
