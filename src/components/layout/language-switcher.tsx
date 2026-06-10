"use client";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageSwitcher({
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, pending, t } = useI18n();

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 text-sm text-[#0F172A]/80",
        className
      )}
    >
      {!compact && (
        <span className="hidden font-medium sm:inline">{t("language.label")}</span>
      )}
      <select
        value={locale}
        disabled={pending}
        onChange={(event) => setLocale(event.target.value as Locale)}
        aria-label={t("language.label")}
        className="h-9 rounded-lg border border-border bg-white px-2.5 text-sm font-medium text-[#0F172A] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 disabled:opacity-60"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
