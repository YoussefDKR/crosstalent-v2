import Link from "next/link";
import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  showTagline?: boolean;
};

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-sm transition-transform group-hover:scale-[1.02]">
        <Globe2 className="size-5" strokeWidth={2} />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-semibold tracking-tight text-[#0F172A]">
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
