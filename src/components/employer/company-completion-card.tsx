"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyCompletion } from "@/types/employer";
import { cn } from "@/lib/utils";

type CompanyCompletionCardProps = {
  completion: CompanyCompletion;
  compact?: boolean;
};

export function CompanyCompletionCard({
  completion,
  compact = false,
}: CompanyCompletionCardProps) {
  const { t } = useI18n();
  const { percent, items } = completion;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className={cn(compact && "pb-2")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-[#0F172A]">
              {t("employer.companyCompletionTitle")}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {percent >= 80
                ? t("employer.companyCompletionStrong")
                : t("employer.companyCompletionStandOut")}
            </p>
          </div>
          <span className="text-3xl font-semibold tabular-nums text-brand-accent">
            {percent}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-brand-accent transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {!compact && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {item.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-brand-success" />
                ) : (
                  <Circle className="size-4 shrink-0 text-slate-300" />
                )}
                <span className={item.done ? "text-[#0F172A]" : undefined}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {percent < 100 && (
          <Link href="/employer/company">
            <Button variant="brandOutline" className="mt-2 w-full gap-2 sm:w-auto">
              {t("employer.completeCompanyProfile")}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
