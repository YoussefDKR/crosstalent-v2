import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/config/brand";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

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

  if (light) {
    return (
      <Link
        href="/"
        className={cn("group flex items-center gap-2.5", className)}
        aria-label={`${siteConfig.name} home`}
      >
        <Image
          src={brandAssets.icon}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-lg transition-transform group-hover:scale-[1.02]"
          priority
        />
        <span className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-white">
            {siteConfig.name}
          </span>
          {showTagline && (
            <span className="text-xs text-white/60">Beyond borders</span>
          )}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src={brandAssets.logoFull}
        alt={siteConfig.name}
        width={200}
        height={48}
        className="h-9 w-auto max-w-[200px] transition-opacity group-hover:opacity-90 sm:h-10"
        priority
      />
      {showTagline && (
        <span className="sr-only">{siteConfig.tagline}</span>
      )}
    </Link>
  );
}
