import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  MessageSquare,
  Languages,
  Sparkles,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ProfileCompletionCard } from "@/components/candidate/profile-completion";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  calculateProfileCompletion,
  getIncompleteLabels,
} from "@/lib/candidate/completion";
import { getCandidateProfileData } from "@/lib/candidate/queries";
import { getServerI18n } from "@/i18n/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("candidate.dashboardTitle") };
}

export default async function CandidateDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t, messages } = await getServerI18n();
  const data = await getCandidateProfileData(profile);
  const completion = calculateProfileCompletion(
    data,
    messages.candidate.completionItems
  );
  const incomplete = getIncompleteLabels(completion).slice(0, 3);

  const firstName =
    profile.fullName?.split(" ")[0] ?? t("candidate.defaultName");

  return (
    <DashboardShell
      profile={profile}
      title={t("candidate.welcomeBack", { name: firstName })}
      description={t("candidate.welcomeDesc")}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileCompletionCard completion={completion} />
        </div>

        <Card className="border-border/80 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-medium text-[#0F172A]">
                {t("candidate.quickTip")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {t("candidate.quickTipDesc")}
              </p>
            </div>
            {incomplete.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("candidate.next")} {incomplete.join(" · ")}
              </p>
            )}
            <Link href="/candidate/profile">
              <Button className="w-full gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                {t("candidate.editProfile")}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          {
            href: siteConfig.links.jobs,
            icon: Briefcase,
            label: t("nav.jobBoard"),
            value: t("candidate.browseRoles"),
            ok: true,
          },
          {
            href: siteConfig.links.candidateMessages,
            icon: MessageSquare,
            label: t("candidate.messagesTitle"),
            value: t("candidate.inbox"),
            ok: true,
          },
          {
            href: "/candidate/profile#cv",
            icon: FileText,
            label: t("candidate.cvLabel"),
            value: data.details?.cv_path
              ? t("candidate.uploaded")
              : t("candidate.missing"),
            ok: Boolean(data.details?.cv_path),
          },
          {
            href: "/candidate/profile#skills",
            icon: Wrench,
            label: t("candidate.skillsLabel"),
            value: t("candidate.added", { count: data.skills.length }),
            ok: data.skills.length >= 3,
          },
          {
            href: "/candidate/profile#languages",
            icon: Languages,
            label: t("candidate.languagesLabel"),
            value: t("candidate.added", { count: data.languages.length }),
            ok: data.languages.length >= 1,
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
