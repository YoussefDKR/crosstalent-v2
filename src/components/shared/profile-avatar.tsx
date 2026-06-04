import Image from "next/image";
import { User } from "lucide-react";
import { resolveImageUrl } from "@/lib/images/urls";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  pathOrUrl: string | null | undefined;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: { box: "size-9", text: "text-xs", icon: "size-4", px: 36 },
  md: { box: "size-11", text: "text-sm", icon: "size-5", px: 44 },
  lg: { box: "size-14", text: "text-base", icon: "size-7", px: 56 },
};

function initials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

export function ProfileAvatar({
  pathOrUrl,
  name,
  size = "md",
  className,
}: ProfileAvatarProps) {
  const src = resolveImageUrl(pathOrUrl);
  const s = sizeMap[size];

  if (src) {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 overflow-hidden rounded-full bg-slate-100",
          s.box,
          className
        )}
      >
        <Image
          src={src}
          alt={name ? `${name} photo` : "Profile photo"}
          width={s.px}
          height={s.px}
          className="size-full object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[#0F172A]/5 font-medium text-[#0F172A]",
        s.box,
        s.text,
        className
      )}
    >
      {name ? initials(name) : <User className={cn(s.icon, "text-muted-foreground")} />}
    </span>
  );
}
