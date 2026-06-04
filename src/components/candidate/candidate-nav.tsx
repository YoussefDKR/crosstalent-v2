"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/candidate/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/candidate/profile", label: "My profile", icon: UserCircle },
  { href: "/candidate/messages", label: "Messages", icon: MessageSquare },
];

export function CandidateNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex gap-1 overflow-x-auto rounded-lg border border-border bg-white p-1 shadow-sm"
      aria-label="Candidate"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#0F172A] text-white"
                : "text-muted-foreground hover:bg-muted hover:text-[#0F172A]"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
