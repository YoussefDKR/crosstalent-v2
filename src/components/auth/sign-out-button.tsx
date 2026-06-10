"use client";

import { useState } from "react";
import { useI18n } from "@/context/i18n-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  redirectTo?: string;
};

export function SignOutButton({
  className,
  variant = "outline",
  size = "sm",
  redirectTo = "/",
}: SignOutButtonProps) {
  const { t } = useI18n();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // Still navigate so the user is not stuck on "Signing out…"
    }
    // Full reload clears SSR cookies and marketing layout auth state
    window.location.href = redirectTo;
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={pending}
      onClick={handleSignOut}
    >
      {pending ? t("common.signingOut") : t("common.signOut")}
    </Button>
  );
}
