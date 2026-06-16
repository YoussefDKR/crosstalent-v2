"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/auth/routes";

/**
 * Supabase auth errors often arrive in the URL hash after redirect; route handlers cannot read them.
 */
export function AuthHashErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const errorCode = params.get("error_code");
    const error = params.get("error");

    if (errorCode === "otp_expired") {
      router.replace(
        `${AUTH_ROUTES.forgotPassword}?error=reset_link_expired`
      );
      return;
    }

    if (error === "access_denied" || errorCode) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, [router]);

  return null;
}
