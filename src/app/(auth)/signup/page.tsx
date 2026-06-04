import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { resolveSignupDefaultRole } from "@/lib/auth/routes";
import { siteConfig } from "@/config/site";

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

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        defaultRole === "employer"
          ? "Start hiring top talent from North Africa."
          : "Build your profile and discover European opportunities."
      }
      footer={
        <Link
          href="/"
          className="text-muted-foreground hover:text-[#0F172A]"
        >
          ← Back to home
        </Link>
      }
    >
      <SignupForm defaultRole={defaultRole} />
    </AuthShell>
  );
}
