import { AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import {
  isStripeConfigured,
  isStripeWebhookConfigured,
} from "@/lib/stripe/config";
import { EMPLOYER_PLANS } from "@/config/billing";

export function StripeSetupBanner() {
  if (isStripeConfigured()) {
    const missingPrices = EMPLOYER_PLANS.filter((p) => !p.stripePriceId);
    if (missingPrices.length === 0 && isStripeWebhookConfigured()) {
      return null;
    }

    return (
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-medium">Finish Stripe setup</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-amber-800/90">
          {missingPrices.length > 0 && (
            <li>
              Add price IDs:{" "}
              {missingPrices
                .map((p) => `STRIPE_PRICE_${p.id.toUpperCase()}`)
                .join(", ")}
            </li>
          )}
          {!isStripeWebhookConfigured() && (
            <li>Set STRIPE_WEBHOOK_SECRET and run the Stripe CLI or Dashboard webhook</li>
          )}
        </ul>
        <Link
          href="/docs/stripe"
          className="mt-2 inline-flex items-center gap-1 font-medium text-[#2563EB] hover:underline"
        >
          <BookOpen className="size-3.5" />
          Setup guide
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 px-4 py-4 text-sm text-[#0F172A]">
      <div className="flex gap-3">
        <AlertCircle className="size-5 shrink-0 text-[#2563EB]" />
        <div>
          <p className="font-medium">Payments not connected yet</p>
          <p className="mt-1 text-muted-foreground">
            CrossTalent works fully while you explore. When you create a Stripe
            account, add your keys to <code className="text-xs">.env.local</code>{" "}
            — checkout buttons will activate automatically.
          </p>
          <Link
            href="/docs/stripe"
            className="mt-2 inline-flex items-center gap-1 font-medium text-[#2563EB] hover:underline"
          >
            <BookOpen className="size-3.5" />
            Stripe setup guide (when you&apos;re ready)
          </Link>
        </div>
      </div>
    </div>
  );
}
