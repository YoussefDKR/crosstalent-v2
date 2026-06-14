# Stripe billing setup

CrossTalent employer billing is built in. **You can use the app without Stripe** — checkout stays disabled until you add keys.

## Quick checklist

1. Run migrations `20250608000000_employer_subscriptions.sql` and `20250618000000_job_post_quotas.sql`
2. Create [Stripe](https://dashboard.stripe.com) account (Test mode)
3. Create **Growth** and **Scale** recurring products, plus **Single post** (€79 one-time); copy each `price_...` ID
4. Fill `.env.local` (see `.env.example`)
5. Webhook: `stripe listen --forward-to localhost:3001/api/stripe/webhook`
6. Test at `/employer/billing` with card `4242 4242 4242 4242`

In-app guide: [http://localhost:3001/docs/stripe](http://localhost:3001/docs/stripe)

## Plans

| Plan | Price | Job posts | Duration each |
|------|-------|-----------|---------------|
| Starter (free) | €0 | 1 | 10 days |
| Growth | €199/mo | 3 | 30 days |
| Scale | €499/mo | 10 | 30 days |
| Single post | €79 one-time | 1 credit | 30 days |

## Environment variables

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server API (`sk_test_...` or `sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing (`whsec_...`) |
| `STRIPE_PRICE_GROWTH` | Price ID for Growth plan |
| `STRIPE_PRICE_SCALE` | Price ID for Scale plan |
| `STRIPE_PRICE_SINGLE_POST` | Price ID for €79 one-time post |
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook writes to `employer_subscriptions` |

## Behavior without Stripe

- Employers keep **full platform access** (jobs, search, messaging).
- Pricing and billing pages show setup instructions.
- Subscribe buttons explain what to configure.

Once keys are set, checkout and the Customer Portal activate automatically.
