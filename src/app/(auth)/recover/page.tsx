import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { RecoverPasswordConfirmForm } from "@/components/auth/recover-password-confirm-form";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { verifyRecoveryTicket } from "@/lib/auth/recovery-ticket";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.recoverTitle") };
}

type RecoverPageProps = {
  searchParams: Promise<{ ticket?: string; token_hash?: string }>;
};

export default async function RecoverPage({ searchParams }: RecoverPageProps) {
  const { t } = await getServerI18n();
  const { ticket, token_hash } = await searchParams;

  const tokenHash =
    (ticket ? verifyRecoveryTicket(ticket) : null) ?? token_hash?.trim() ?? "";

  if (!tokenHash) {
    redirect(`${AUTH_ROUTES.forgotPassword}?error=reset_link_expired`);
  }

  return (
    <AuthShell
      title={t("auth.recoverTitle")}
      subtitle={t("auth.recoverSubtitle")}
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          {t("common.backToHome")}
        </Link>
      }
    >
      <RecoverPasswordConfirmForm tokenHash={tokenHash} />
    </AuthShell>
  );
}
