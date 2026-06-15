import Link from "next/link";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type AdminFiltersProps = {
  options: FilterOption[];
  active: string;
  param: string;
  basePath: string;
  extraParams?: Record<string, string>;
};

export function AdminFilters({
  options,
  active,
  param,
  basePath,
  extraParams = {},
}: AdminFiltersProps) {
  function hrefFor(value: string) {
    const params = new URLSearchParams(extraParams);
    if (value === "all") {
      params.delete(param);
    } else {
      params.set(param, value);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Link
          key={option.value}
          href={hrefFor(option.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            active === option.value
              ? "bg-brand-accent text-white"
              : "bg-white text-muted-foreground ring-1 ring-border hover:text-foreground"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
