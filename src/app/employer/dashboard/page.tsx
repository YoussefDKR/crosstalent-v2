import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Search,
  Sparkles,
  Users,
  CreditCard,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { CompanyCompletionCard } from "@/components/employer/company-completion-card";
import { EmployerNav } from "@/components/employer/employer-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  calculateCompanyCompletion,
  getIncompleteCompanyLabels,
} from "@/lib/employer/completion";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { searchCandidates } from "@/lib/employer/candidate-search";
import { listEmployerJobs } from "@/lib/jobs/queries";

export const metadata: Metadata = {
  title: "Employer dashboard",
};

export default async function EmployerDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const data = await getCompanyProfileData(profile);
  const jobs = await listEmployerJobs(profile.id);
  const publishedCount = jobs.filter((j) => j.status === "published").length;
  const { candidates: talentPool } = await searchCandidates();
  const completion = calculateCompanyCompletion(data);
  const incomplete = getIncompleteCompanyLabels(completion).slice(0, 3);
  const companyName = data.company?.company_name ?? "your company";

  return (
    <DashboardShell
      profile={profile}
      title={`Welcome${profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}`}
      description={`Manage ${companyName} and hire cross-border talent from North Africa.`}
    >
      <EmployerNav />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CompanyCompletionCard completion={completion} />
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-medium text-[#0F172A]">Hiring tip</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Companies with complete profiles receive more applications from
                vetted MENA candidates.
              </p>
            </div>
            {incomplete.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Next: {incomplete.join(" · ")}
              </p>
            )}
            <Link href="/employer/company">
              <Button className="w-full gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                Edit company profile
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            href: "/employer/company",
            icon: Building2,
            label: "Company",
            value: data.company?.company_name ? "Set up" : "Incomplete",
            ok: Boolean(data.company?.company_name),
          },
          {
            href: "/employer/jobs",
            icon: Search,
            label: "Job posts",
            value:
              jobs.length === 0
                ? "None yet"
                : `${publishedCount} live · ${jobs.length} total`,
            ok: publishedCount > 0,
          },
          {
            href: "/employer/candidates",
            icon: Users,
            label: "Find talent",
            value:
              talentPool.length === 0
                ? "No profiles yet"
                : `${talentPool.length} candidate${talentPool.length === 1 ? "" : "s"}`,
            ok: talentPool.length > 0,
          },
          {
            href: siteConfig.links.employerBilling,
            icon: CreditCard,
            label: "Billing",
            value: "Plans",
            ok: true,
          },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <item.icon
                  className={
                    item.ok ? "size-8 text-[#10B981]" : "size-8 text-muted-foreground"
                  }
                />
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[#0F172A]">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
