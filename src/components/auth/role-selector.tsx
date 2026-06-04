"use client";

import { Building2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

type RoleSelectorProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
};

const options: {
  role: UserRole;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    role: "candidate",
    title: "Candidate",
    description: "Free · Looking for opportunities in Europe",
    icon: GraduationCap,
  },
  {
    role: "employer",
    title: "Employer",
    description: "Paid plans · Hiring from North Africa",
    icon: Building2,
  },
];

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
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
