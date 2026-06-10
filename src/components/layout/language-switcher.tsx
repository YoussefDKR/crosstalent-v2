"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LOCALE_ABBREV, LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, pending, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function handleSelect(nextLocale: Locale) {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }
    setLocale(nextLocale);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        aria-label={t("language.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-sm font-semibold text-[#0F172A] shadow-sm outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 disabled:opacity-60"
      >
        <Globe className="size-4 shrink-0 text-[#2563EB]" aria-hidden />
        <span className="tabular-nums">{LOCALE_ABBREV[locale]}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language.label")}
          className="absolute end-0 top-full z-[100] mt-1.5 min-w-[9.5rem] overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          {LOCALES.map((code) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                onClick={() => handleSelect(code)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-start text-sm font-medium text-[#0F172A] transition-colors hover:bg-slate-50",
                  locale === code && "bg-[#2563EB]/5 text-[#2563EB]"
                )}
              >
                <span className="w-7 shrink-0 font-semibold tabular-nums">
                  {LOCALE_ABBREV[code]}
                </span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">
                  {LOCALE_LABELS[code]}
                </span>
                {locale === code && (
                  <Check className="size-3.5 shrink-0" aria-hidden />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
