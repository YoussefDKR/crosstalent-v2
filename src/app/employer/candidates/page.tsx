import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EmployerUpgradeGate } from "@/components/billing/employer-upgrade-gate";
import { CandidateCard } from "@/components/employer/candidate-card";
import { CandidateFilters } from "@/components/employer/candidate-filters";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getEmployerFeatureAccess } from "@/lib/billing/access";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  parseCandidateFilters,
  searchCandidates,
} from "@/lib/employer/candidate-search";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.findTalent") };
}

export default async function EmployerCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();
  const access = await getEmployerFeatureAccess(profile.id);

  if (!access.canViewCandidates) {
    return (
      <DashboardShell
        profile={profile}
        title={t("employer.findTalent")}
        description={t("employer.findTalentGateSubtitle")}
      >
        <EmployerUpgradeGate
          variant="candidates"
          access={access}
          title={t("employer.candidatesPremiumTitle")}
          description={t("employer.candidatesPremiumDesc")}
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
      title={t("employer.findTalent")}
      description={t("employer.findTalentSubtitle")}
    >
      {access.isTrialActive && access.trialDaysRemaining != null && (
        <p className="mb-4 rounded-lg bg-[#EFF6FF] px-4 py-3 text-sm text-[#1d4ed8]">
          {t(
            access.trialDaysRemaining === 1
              ? "employer.trialIncludesSearch"
              : "employer.trialIncludesSearchPlural",
            {
              days: access.trialDaysRemaining ?? 0,
              limit: access.publishedJobLimit ?? 0,
            }
          )}
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
        {candidates.length === 1
          ? t("employer.candidateSingular")
          : t("employer.candidatePlural")}{" "}
        {t("employer.candidatesFoundSuffix")}
        {candidates.length > 0 && (
          <span className="block mt-1 text-[#0F172A]/70">
            {t("employer.sortedByCompleteness")}
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
              ? t("employer.noCandidatesMatch")
              : t("employer.noCandidatesYet")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasActiveFilters
              ? t("employer.noCandidatesMatchHint")
              : t("employer.noCandidatesYetHint")}
          </p>
        </div>
      )}
    </DashboardShell>
  );
}
