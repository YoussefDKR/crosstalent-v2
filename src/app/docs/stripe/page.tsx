import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isStripeConfigured } from "@/lib/stripe/config";

export const metadata: Metadata = {
  title: "Stripe setup",
};

export default function StripeDocsPage() {
  const configured = isStripeConfigured();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/employer/billing"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0F172A]"
      >
        <ArrowLeft className="size-4" />
        Back to billing
      </Link>

      <h1 className="mt-8 text-3xl font-semibold text-[#0F172A]">
        Stripe setup guide
      </h1>
      <p className="mt-3 text-muted-foreground">
        CrossTalent billing is wired and ready. Status:{" "}
        <strong>{configured ? "keys detected" : "waiting for keys"}</strong>.
      </p>

      <div className="prose prose-slate mt-10 max-w-none space-y-8 text-sm leading-relaxed text-[#0F172A]/90">
        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            1. Create a Stripe account
          </h2>
          <p>
            Sign up at{" "}
            <a
              href="https://dashboard.stripe.com/register"
              className="text-[#2563EB] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              stripe.com
            </a>
            . Use Test mode while developing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            2. Create products & prices
          </h2>
          <p>In Stripe Dashboard → Products, create two recurring prices:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Growth</strong> — e.g. €199/month → copy the Price ID
              (starts with <code>price_</code>)
            </li>
            <li>
              <strong>Scale</strong> — e.g. €499/month → copy the Price ID
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            3. Add keys to <code>.env.local</code>
          </h2>
          <pre className="overflow-x-auto rounded-lg bg-[#0F172A] p-4 text-xs text-slate-100">
{`STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_SCALE=price_...

SUPABASE_SERVICE_ROLE_KEY=...  # required for webhooks`}
          </pre>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            4. Run Supabase migration
          </h2>
          <p>
            Execute{" "}
            <code>supabase/migrations/20250608000000_employer_subscriptions.sql</code>{" "}
            in the SQL Editor if you have not already.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            5. Webhook (local dev)
          </h2>
          <pre className="overflow-x-auto rounded-lg bg-slate-100 p-4 text-xs text-[#0F172A]">
{`stripe listen --forward-to localhost:3001/api/stripe/webhook`}
          </pre>
          <p className="mt-2">
            Copy the signing secret into <code>STRIPE_WEBHOOK_SECRET</code>.
            Listen for: <code>checkout.session.completed</code>,{" "}
            <code>customer.subscription.updated</code>,{" "}
            <code>customer.subscription.deleted</code>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            6. Test checkout
          </h2>
          <p>
            Log in as employer → Billing → choose Growth or Scale. Use card{" "}
            <code>4242 4242 4242 4242</code> in Test mode.
          </p>
        </section>

        <section className="rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-4">
          <p className="font-medium text-[#0F172A]">Before Stripe is configured</p>
          <p className="mt-2 text-muted-foreground">
            The app keeps full access for employers so you can keep building and
            testing. Checkout buttons show a short message until keys and price
            IDs are set.
          </p>
        </section>
      </div>
    </div>
  );
}
