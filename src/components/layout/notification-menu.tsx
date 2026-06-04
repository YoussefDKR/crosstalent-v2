"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Briefcase, MessageSquare } from "lucide-react";
import type { AppNotification } from "@/types/notifications";
import type { UserRole } from "@/types";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type NotificationMenuProps = {
  notifications: AppNotification[];
  role: UserRole;
};

export function NotificationMenu({
  notifications,
  role,
}: NotificationMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = notifications.length;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const viewAllHref =
    role === "employer"
      ? siteConfig.links.employerMessages
      : siteConfig.links.candidateMessages;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-lg border border-border/80 bg-white text-[#0F172A] transition-colors hover:bg-slate-50",
          open && "border-[#2563EB]/40 bg-[#2563EB]/5"
        )}
        aria-label={
          count > 0
            ? `${count} notifications`
            : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="size-5" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-border/80 bg-white shadow-lg"
          role="menu"
        >
          <div className="border-b border-border/60 px-4 py-3">
            <p className="text-sm font-semibold text-[#0F172A]">
              Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              {count === 0
                ? "You're all caught up"
                : `${count} item${count === 1 ? "" : "s"}`}
            </p>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                No new messages or applications right now.
              </li>
            ) : (
              notifications.map((item) => (
                <li key={item.id} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex gap-3 border-b border-border/40 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                        item.type === "message"
                          ? "bg-[#2563EB]/10 text-[#2563EB]"
                          : "bg-violet-100 text-violet-700"
                      )}
                    >
                      {item.type === "message" ? (
                        <MessageSquare className="size-4" />
                      ) : (
                        <Briefcase className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#0F172A]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {item.body}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {item.timeLabel}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>

          <div className="border-t border-border/60 p-2">
            <Link
              href={viewAllHref}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-[#2563EB] hover:bg-[#2563EB]/5"
            >
              View messages
            </Link>
            {role === "employer" && count > 0 && (
              <Link
                href={siteConfig.links.employerApplications}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-slate-50"
              >
                View applications
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
