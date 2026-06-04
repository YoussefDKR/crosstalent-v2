import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/shared/logo";
import type { Profile } from "@/types";

type DashboardShellProps = {
  profile: Profile;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardShell({
  profile,
  title,
  description,
  children,
}: DashboardShellProps) {
  const roleLabel =
    profile.role === "candidate" ? "Candidate" : "Employer";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.fullName ?? profile.email ?? "Account"} · {roleLabel}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function DashboardPlaceholderCard({
  phase,
  items,
}: {
  phase: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-[#2563EB]">Coming in {phase}</p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#10B981]" />
            {item}
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-[#2563EB] hover:underline"
      >
        Back to marketing site
      </Link>
    </div>
  );
}
