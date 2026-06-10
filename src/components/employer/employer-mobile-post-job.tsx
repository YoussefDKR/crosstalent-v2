"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

export function EmployerMobilePostJob() {
  const { t } = useI18n();

  return (
    <div className="shrink-0 border-b border-[#2563EB]/20 bg-[#2563EB] px-4 py-3 lg:hidden">
      <Link href="/employer/jobs/new" className="block">
        <Button
          size="lg"
          className="h-12 w-full gap-2 rounded-xl bg-white text-base font-semibold text-[#2563EB] shadow-sm hover:bg-white/95"
        >
          <Plus className="size-4 shrink-0" strokeWidth={2.5} />
          <span className="truncate">{t("employer.postNewJob")}</span>
        </Button>
      </Link>
    </div>
  );
}
