import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("auth.forgotPasswordTitle"),
    description: `Reset your ${siteConfig.name} password`,
  };
}

type ForgotPasswordPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { t } = await getServerI18n();
  const { error } = await searchParams;

  const initialError =
    error === "reset_link_expired"
      ? t("auth.resetPasswordSessionExpired")
      : undefined;

  return (
    <AuthShell
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotPasswordSubtitle")}
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          {t("common.backToHome")}
        </Link>
      }
    >
      <ForgotPasswordForm initialError={initialError} />
    </AuthShell>
  );
}
