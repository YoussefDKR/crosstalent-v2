"use client";

import { useI18n } from "@/context/i18n-provider";

export function AuthDivider() {
  const { t } = useI18n();

  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-white px-3 text-muted-foreground">{t("auth.or")}</span>
      </div>
    </div>
  );
}
