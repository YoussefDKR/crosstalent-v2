import Link from "next/link";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  showTagline?: boolean;
  variant?: "default" | "light";
};

export function Logo({
  className,
  showTagline = false,
  variant = "default",
}: LogoProps) {
  const light = variant === "light";

  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-[1.02]",
          light ? "bg-[#2563EB] text-white" : "bg-[#0F172A] text-white"
        )}
      >
        <Globe2 className="size-5" strokeWidth={2} />
      </span>
      <span className="flex flex-col">
        <span
          className={cn(
            "text-base font-semibold tracking-tight",
            light ? "text-white" : "text-[#0F172A]"
          )}
        >
          {siteConfig.name}
        </span>
        {showTagline && (
          <span className="text-xs text-muted-foreground">
            Beyond borders
          </span>
        )}
      </span>
    </Link>
  );
}
