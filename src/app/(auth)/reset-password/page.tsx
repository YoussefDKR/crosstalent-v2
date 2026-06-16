import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("auth.resetPasswordTitle"),
    description: `Set a new password for your ${siteConfig.name} account`,
  };
}

export default async function ResetPasswordPage() {
  const { t } = await getServerI18n();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      title={t("auth.resetPasswordTitle")}
      subtitle={t("auth.resetPasswordSubtitle")}
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          {t("common.backToHome")}
        </Link>
      }
    >
      {user ? (
        <ResetPasswordForm />
      ) : (
        <div className="space-y-5">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {t("auth.resetPasswordSessionExpired")}
          </p>
          <Link href={AUTH_ROUTES.forgotPassword}>
            <Button variant="brand" className="w-full">
              {t("auth.requestNewLink")}
            </Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={siteConfig.links.login}
              className="font-medium text-[#2563EB] hover:underline"
            >
              {t("auth.backToSignIn")}
            </Link>
          </p>
        </div>
      )}
    </AuthShell>
  );
}
