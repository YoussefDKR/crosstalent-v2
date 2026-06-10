"use client";

import { Calendar } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import type { Locale } from "@/i18n/config";

function greetingKey(hour: number): "goodMorning" | "goodAfternoon" | "goodEvening" {
  if (hour < 12) return "goodMorning";
  if (hour < 18) return "goodAfternoon";
  return "goodEvening";
}

function dateLocale(locale: Locale): string {
  if (locale === "ar") return "ar";
  if (locale === "fr") return "fr-FR";
  return "en-US";
}

type DashboardGreetingProps = {
  firstName: string | null;
};

export function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  const { locale, t } = useI18n();
  const hour = new Date().getHours();
  const greeting = t(`employer.${greetingKey(hour)}`);
  const name = firstName?.trim();

  const monthLabel = new Date().toLocaleDateString(dateLocale(locale), {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
          {greeting}
          {name ? `, ${name}` : ""}{" "}
          <span aria-hidden>👋</span>
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {t("employer.hiringToday")}
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">
        <Calendar className="size-4 shrink-0" />
        <span>{monthLabel}</span>
      </div>
    </div>
  );
}
