"use client";

import { Building2, GraduationCap } from "lucide-react";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type RoleSelectorProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
};

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  const { t } = useI18n();

  const options = [
    {
      role: "candidate" as const,
      title: t("auth.candidate"),
      description: t("auth.candidateRoleDesc"),
      icon: GraduationCap,
    },
    {
      role: "employer" as const,
      title: t("auth.employer"),
      description: t("auth.employerRoleDesc"),
      icon: Building2,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const Icon = option.icon;
        const selected = value === option.role;
        return (
          <button
            key={option.role}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.role)}
            className={cn(
              "rounded-lg border p-4 text-left transition-all",
              selected
                ? "border-[#2563EB] bg-[#2563EB]/5 ring-2 ring-[#2563EB]/20"
                : "border-border bg-white hover:border-[#0F172A]/20",
              disabled && "pointer-events-none opacity-60"
            )}
          >
            <Icon
              className={cn(
                "size-5",
                selected ? "text-[#2563EB]" : "text-muted-foreground"
              )}
            />
            <p className="mt-3 text-sm font-semibold text-[#0F172A]">
              {option.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
