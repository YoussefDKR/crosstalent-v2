import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { confirmAndDeleteAccount } from "@/lib/auth/delete-account";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Confirm account deletion",
  robots: { index: false, follow: false },
};

type ConfirmDeletePageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ConfirmDeletePage({
  searchParams,
}: ConfirmDeletePageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <StatusPage
        title="Invalid link"
        message="This deletion link is missing or invalid."
        variant="error"
      />
    );
  }

  const result = await confirmAndDeleteAccount(token);

  if (!result.ok) {
    return (
      <StatusPage
        title="Could not delete account"
        message={result.error}
        variant="error"
      />
    );
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}

function StatusPage({
  title,
  message,
  variant,
}: {
  title: string;
  message: string;
  variant: "error";
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[#0F172A]">{title}</h1>
        <p
          className={
            variant === "error"
              ? "mt-4 text-sm text-red-700"
              : "mt-4 text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={siteConfig.links.contact}
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Contact support
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
