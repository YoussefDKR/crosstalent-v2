"use client";

import { Calendar } from "lucide-react";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type DashboardGreetingProps = {
  firstName: string | null;
};

export function DashboardGreeting({ firstName }: DashboardGreetingProps) {
  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const name = firstName?.trim();

  const now = new Date();
  const monthLabel = now.toLocaleDateString(undefined, {
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
          Here&apos;s what&apos;s happening with your hiring today.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">
        <Calendar className="size-4 shrink-0" />
        <span>{monthLabel}</span>
      </div>
    </div>
  );
}
