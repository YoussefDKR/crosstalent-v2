"use client";

import { Check, X } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import {
  evaluatePasswordStrength,
  type PasswordStrengthLevel,
} from "@/lib/auth/password-strength";
import { cn } from "@/lib/utils";

type PasswordStrengthMeterProps = {
  password: string;
  className?: string;
};

const BAR_COLORS: Record<PasswordStrengthLevel, string> = {
  empty: "bg-slate-200",
  weak: "bg-red-500",
  fair: "bg-amber-500",
  good: "bg-[#2563EB]",
  strong: "bg-emerald-500",
};

const LABEL_COLORS: Record<PasswordStrengthLevel, string> = {
  empty: "text-muted-foreground",
  weak: "text-red-600",
  fair: "text-amber-600",
  good: "text-[#2563EB]",
  strong: "text-emerald-600",
};

const REQ_KEYS = {
  length: "reqLength",
  lower: "reqLower",
  upper: "reqUpper",
  number: "reqNumber",
  special: "reqSpecial",
} as const;

const STRENGTH_KEYS = {
  empty: "strengthEmpty",
  weak: "strengthWeak",
  fair: "strengthFair",
  good: "strengthGood",
  strong: "strengthStrong",
} as const;

export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const { messages, t } = useI18n();
  const a = messages.account;
  const strength = evaluatePasswordStrength(password);

  const strengthLabel =
    strength.level === "empty"
      ? a.strengthEmpty
      : a[STRENGTH_KEYS[strength.level]];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{a.passwordStrength}</span>
        <span
          className={cn("font-medium tabular-nums", LABEL_COLORS[strength.level])}
        >
          {strengthLabel}
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={strength.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t("account.passwordStrengthAria", { label: strengthLabel })}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            BAR_COLORS[strength.level]
          )}
          style={{ width: `${strength.percent}%` }}
        />
      </div>

      <ul
        className="grid gap-1.5 sm:grid-cols-2"
        aria-label={a.passwordRequirements}
      >
        {strength.requirements.map((req) => {
          const key = REQ_KEYS[req.id as keyof typeof REQ_KEYS];
          const label = key ? a[key] : req.label;
          return (
            <li
              key={req.id}
              className={cn(
                "flex items-center gap-2 text-sm",
                req.met ? "text-[#047857]" : "text-muted-foreground"
              )}
            >
              {req.met ? (
                <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <X className="size-4 shrink-0 text-slate-300" aria-hidden />
              )}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
