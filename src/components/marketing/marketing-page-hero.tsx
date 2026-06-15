import { MarketingGradientBg } from "@/components/marketing/marketing-gradient-bg";
import { cn } from "@/lib/utils";

export const marketingOutlineButtonClass =
  "h-12 min-w-[200px] rounded-lg border-2 border-white/25 bg-white/5 text-base font-semibold text-white hover:border-white/40 hover:bg-white/10";

export const marketingPrimaryButtonClass =
  "h-12 min-w-[200px] rounded-lg bg-[#2563EB] text-base font-semibold text-white shadow-lg shadow-[#2563EB]/30 hover:bg-[#1d4ed8]";

type MarketingPageHeroProps = {
  eyebrow?: string;
  eyebrowClassName?: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  align?: "center" | "left";
  actions?: React.ReactNode;
  note?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

export function MarketingPageHero({
  eyebrow,
  eyebrowClassName = "text-[#60A5FA]",
  title,
  subtitle,
  align = "left",
  actions,
  note,
  aside,
  className,
}: MarketingPageHeroProps) {
  const centered = align === "center";

  const copy = (
    <div className={cn(centered && "mx-auto max-w-4xl text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-wider",
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className={cn(
          "text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:leading-[1.1]",
          eyebrow ? "mt-4" : "mt-0",
          centered && "lg:text-[3.25rem]"
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-6 text-lg leading-relaxed text-slate-300",
          centered && "mx-auto max-w-2xl"
        )}
      >
        {subtitle}
      </p>
      {actions && (
        <div
          className={cn(
            "mt-8 flex flex-col gap-3 sm:flex-row",
            centered && "items-center justify-center"
          )}
        >
          {actions}
        </div>
      )}
      {note && (
        <div
          className={cn(
            "mt-4 text-sm text-slate-400",
            centered && "flex justify-center"
          )}
        >
          {note}
        </div>
      )}
    </div>
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/5 bg-[#0F172A] py-16 text-white sm:py-24",
        className
      )}
    >
      <MarketingGradientBg opacity={45} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {aside ? (
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {copy}
            <div>{aside}</div>
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}
