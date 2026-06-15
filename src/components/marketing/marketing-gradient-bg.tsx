import { cn } from "@/lib/utils";

export const marketingGradientStyle = {
  backgroundImage:
    "radial-gradient(circle at 10% 20%, #2563EB 0%, transparent 45%), radial-gradient(circle at 90% 80%, #10B981 0%, transparent 40%)",
} as const;

type MarketingGradientBgProps = {
  className?: string;
  opacity?: number;
};

export function MarketingGradientBg({
  className,
  opacity = 45,
}: MarketingGradientBgProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
      style={{ ...marketingGradientStyle, opacity: opacity / 100 }}
    />
  );
}
