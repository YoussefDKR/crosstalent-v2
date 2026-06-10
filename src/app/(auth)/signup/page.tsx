import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { resolveSignupDefaultRole } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";
import { getServerI18n } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Create account",
  description: `Join ${siteConfig.name} as a candidate or employer`,
};

type SignupPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { role: roleParam } = await searchParams;
  const defaultRole = resolveSignupDefaultRole(roleParam);
  const { t } = await getServerI18n();

  return (
    <AuthShell
      title={t("auth.createAccount")}
      subtitle={
        defaultRole === "employer"
          ? t("auth.signupEmployerSubtitle")
          : t("auth.signupCandidateSubtitle")
      }
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          {t("common.backToHome")}
        </Link>
      }
    >
      <SignupForm defaultRole={defaultRole} />
    </AuthShell>
  );
}
