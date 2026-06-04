import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MarketingCtaBandProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "light" | "dark";
};

export function MarketingCtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  variant = "dark",
}: MarketingCtaBandProps) {
  const dark = variant === "dark";

  return (
    <section
      className={cn(
        "py-16 sm:py-20",
        dark ? "bg-[#0F172A] text-white" : "bg-[#F8FAFC]"
      )}
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          className={cn(
            "text-3xl font-semibold tracking-tight sm:text-4xl",
            !dark && "text-[#0F172A]"
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-slate-300" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={primaryHref}>
            <Button
              size="lg"
              className={cn(
                "h-12 min-w-[220px] gap-2 text-base font-semibold",
                dark
                  ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
                  : "bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
              )}
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref}>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "h-12 min-w-[220px] text-base font-semibold",
                  dark
                    ? "border-white/30 bg-transparent text-white hover:bg-white/10"
                    : "border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5"
                )}
              >
                {secondaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
