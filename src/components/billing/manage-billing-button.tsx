"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

type ManageBillingButtonProps = {
  disabled?: boolean;
};

export function ManageBillingButton({ disabled }: ManageBillingButtonProps) {
  const { messages } = useI18n();
  const b = messages.billing;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? b.portalFailed);
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      setError(b.portalNetworkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={disabled || loading}
        onClick={openPortal}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CreditCard className="size-4" />
        )}
        {b.manageSubscription}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
