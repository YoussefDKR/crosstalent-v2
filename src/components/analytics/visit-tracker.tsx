"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackVisitPath } from "@/config/analytics";

const SESSION_KEY = "ct_visit_logged";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldTrackVisitPath(pathname)) return;

    const today = new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(SESSION_KEY) === today) return;

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) sessionStorage.setItem(SESSION_KEY, today);
      })
      .catch(() => {
        // Non-blocking analytics
      });
  }, [pathname]);

  return null;
}
