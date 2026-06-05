"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_CONSENT_KEY,
  type CookieConsentChoice,
} from "@/config/cookies";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

function readConsent(): CookieConsentChoice | null {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // localStorage unavailable
  }
  return null;
}

function saveConsent(choice: CookieConsentChoice) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  } catch {
    // ignore
  }
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readConsent() === null);
  }, []);

  function handleChoice(choice: CookieConsentChoice) {
    saveConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p
            id="cookie-consent-title"
            className="text-sm font-semibold text-[#0F172A]"
          >
            Cookies on {siteConfig.name}
          </p>
          <p
            id="cookie-consent-desc"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            We use essential cookies to keep you signed in and to protect the
            service. We do not use advertising cookies. See our{" "}
            <Link
              href={siteConfig.links.privacy}
              className="font-medium text-[#2563EB] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleChoice("declined")}
            className="h-10 px-4"
          >
            Decline
          </Button>
          <Button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="h-10 bg-[#2563EB] px-4 text-white hover:bg-[#1d4ed8]"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
