import { CandidateAppShell } from "@/components/candidate/candidate-app-shell";
import { EmployerAppShell } from "@/components/employer/employer-app-shell";
import type { Profile } from "@/types";

type DashboardShellProps = {
  profile: Profile;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export function DashboardShell({
  profile,
  title,
  description,
  children,
}: DashboardShellProps) {
  if (profile.role === "candidate") {
    return (
      <CandidateAppShell
        profile={profile}
        title={title}
        description={description}
      >
        {children}
      </CandidateAppShell>
    );
  }

  return (
    <EmployerAppShell profile={profile}>
      {(title || description) && (
        <header className="mb-8">
          {title && (
            <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
              {title}
            </h1>
          )}
          {description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </header>
      )}
      {children}
    </EmployerAppShell>
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
    <div className="rounded-2xl border border-dashed border-border bg-white p-10 shadow-sm">
      <p className="text-sm font-medium text-[#2563EB]">Coming in {phase}</p>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#10B981]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
