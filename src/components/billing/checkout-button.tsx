"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EmployerPlanId } from "@/config/billing";

type CheckoutButtonProps = {
  planId: EmployerPlanId;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
  variant?: "default" | "outline";
  className?: string;
};

export function CheckoutButton({
  planId,
  label,
  disabled,
  disabledReason,
  variant = "default",
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        variant={variant}
        disabled={disabled || loading}
        onClick={handleCheckout}
        className={
          variant === "default"
            ? `w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] ${className ?? ""}`
            : `w-full ${className ?? ""}`
        }
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          label
        )}
      </Button>
      {(error || (disabled && disabledReason)) && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {error ?? disabledReason}
        </p>
      )}
    </div>
  );
}
