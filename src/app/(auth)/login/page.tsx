import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/config/site";

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

  const authError =
    error === "auth_callback_failed"
      ? "Email confirmation failed. Please try signing in again."
      : undefined;

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your CrossTalent dashboard."
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          ← Back to home
        </Link>
      }
    >
      <LoginForm redirectTo={redirectTo} authError={authError} />
    </AuthShell>
  );
}
