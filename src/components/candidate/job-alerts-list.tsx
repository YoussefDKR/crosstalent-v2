"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bell, BellOff, Trash2 } from "lucide-react";
import {
  deleteJobAlert,
  toggleJobAlertActive,
} from "@/app/candidate/job-board-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-provider";
import type { JobAlertRow } from "@/lib/candidate/job-alerts";
import { hasAlertCriteria } from "@/lib/candidate/job-alerts";

type JobAlertsListProps = {
  alerts: JobAlertRow[];
  matchCounts: Record<string, number>;
};

function criteriaSummary(alert: JobAlertRow): string {
  const parts: string[] = [];
  if (alert.q) parts.push(alert.q);
  if (alert.country) parts.push(alert.country);
  if (alert.remote_type) parts.push(alert.remote_type);
  if (alert.employment_type) parts.push(alert.employment_type);
  if (alert.experience_level) parts.push(alert.experience_level);
  if (alert.skill) parts.push(alert.skill);
  if (alert.salary_min) parts.push(`≥€${alert.salary_min}`);
  return parts.join(" · ") || "—";
}

export function JobAlertsList({ alerts, matchCounts }: JobAlertsListProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (alerts.length === 0) {
    return (
      <Card className="border-dashed border-border/80 shadow-sm">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          {t("jobs.noAlertsYet")}
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-4">
      {alerts.map((alert) => {
        const matches = matchCounts[alert.id] ?? 0;
        const active = alert.is_active;

        return (
          <li key={alert.id}>
            <Card className="border-border/80 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#0F172A]">{alert.name}</h3>
                    {!active && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-muted-foreground">
                        {t("jobs.alertPaused")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {hasAlertCriteria(alert) ? criteriaSummary(alert) : "—"}
                  </p>
                  <p className="mt-2 text-sm text-[#2563EB]">
                    {matches === 1
                      ? t("jobs.alertMatchOne", { count: matches })
                      : t("jobs.alertMatchMany", { count: matches })}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link href={`/jobs?${buildSearchQuery(alert)}`}>
                    <Button variant="outline" size="sm">
                      {t("jobs.viewMatches")}
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await toggleJobAlertActive(alert.id, !active);
                        router.refresh();
                      })
                    }
                  >
                    {active ? (
                      <>
                        <BellOff className="size-3.5" />
                        {t("jobs.pauseAlert")}
                      </>
                    ) : (
                      <>
                        <Bell className="size-3.5" />
                        {t("jobs.enableAlert")}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-red-600 hover:text-red-700"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        await deleteJobAlert(alert.id);
                        router.refresh();
                      })
                    }
                  >
                    <Trash2 className="size-3.5" />
                    {t("jobs.deleteAlert")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

function buildSearchQuery(alert: JobAlertRow): string {
  const params = new URLSearchParams();
  if (alert.q) params.set("q", alert.q);
  if (alert.country) params.set("country", alert.country);
  if (alert.employment_type) params.set("employmentType", alert.employment_type);
  if (alert.remote_type) params.set("remoteType", alert.remote_type);
  if (alert.experience_level) params.set("experienceLevel", alert.experience_level);
  if (alert.skill) params.set("skill", alert.skill);
  if (alert.salary_min) params.set("salaryMin", String(alert.salary_min));
  return params.toString();
}
