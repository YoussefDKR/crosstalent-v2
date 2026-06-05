import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmployerUpgradeGate } from "@/components/billing/employer-upgrade-gate";
import { CandidateCard } from "@/components/employer/candidate-card";
import { CandidateFilters } from "@/components/employer/candidate-filters";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  parseCandidateFilters,
  searchCandidates,
} from "@/lib/employer/candidate-search";

export const metadata: Metadata = {
  title: "Find talent",
};

export default async function EmployerCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const access = await getEmployerFeatureAccess(profile.id);

  if (!access.canViewCandidates) {
    return (
      <DashboardShell
        profile={profile}
        title="Find talent"
        description="Search North African candidates when your trial or subscription is active."
      >
        <EmployerUpgradeGate
          variant="candidates"
          access={access}
          title="Candidate search is a premium feature"
          description="Subscribe or use your free 30-day trial to browse talent, filter by skills, and message candidates."
        />
      </DashboardShell>
    );
  }

  const params = await searchParams;
  const filters = parseCandidateFilters(params);
  const { candidates, error } = await searchCandidates(filters);

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.country ||
      filters.skill ||
      filters.language ||
      filters.hasCv
  );

  return (
    <DashboardShell
      profile={profile}
      title="Find talent"
      description="Search North African candidates by country, skills, languages, and profile strength."
    >
      {access.isTrialActive && access.trialDaysRemaining != null && (
        <p className="mb-4 rounded-lg bg-[#EFF6FF] px-4 py-3 text-sm text-[#1d4ed8]">
          Free trial · {access.trialDaysRemaining} day
          {access.trialDaysRemaining === 1 ? "" : "s"} left · includes candidate
          search and {access.publishedJobLimit} published job
        </p>
      )}

      <Suspense fallback={<div className="mb-6 h-40 rounded-lg bg-white" />}>
        <CandidateFilters />
      </Suspense>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {candidates.length}{" "}
        {candidates.length === 1 ? "candidate" : "candidates"} found
        {candidates.length > 0 && (
          <span className="block mt-1 text-[#0F172A]/70">
            Sorted by profile completeness — stronger profiles appear first.
          </span>
        )}
      </p>

      {candidates.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-white p-12 text-center">
          <p className="font-medium text-[#0F172A]">
            {hasActiveFilters
              ? "No candidates match your filters"
              : "No candidates registered yet"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try broader filters or clear them to see all talent."
              : "When candidates sign up and build profiles, they will appear here."}
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
