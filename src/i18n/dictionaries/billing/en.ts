export const billingEn = {
  pageTitle: "Employer pricing",
  pageSubtitle:
    "Candidates always join free. Employers choose a plan when ready to post jobs and scale hiring.",
  billingDashboard: "Billing dashboard",
  freeToStart: "Free to start",
  oneTimePost: "One-time",
  perMonth: "/ month",
  perOneTime: " one-time",
  currentTier: "Your current explore tier",
  signupEmployer: "Sign up as employer",
  mostPopular: "Most popular",
  stripeNotReady: "Add Stripe keys to .env.local to enable checkout",
  configureStripeEnv: "Configure Stripe in .env.local",
  missingPriceEnv: "Set STRIPE_PRICE_{plan}",
  stripeNotConnectedTitle: "Payments not connected yet",
  stripeNotConnectedDesc:
    "CrossTalent works fully while you explore. When you create a Stripe account, add your keys to .env.local — checkout buttons will activate automatically.",
  stripeSetupGuideReady: "Stripe setup guide (when you're ready)",
  finishStripeSetup: "Finish Stripe setup",
  addPriceIds: "Add price IDs:",
  webhookSecretHint:
    "Set STRIPE_WEBHOOK_SECRET and run the Stripe CLI or Dashboard webhook",
  setupGuide: "Setup guide",
  checkoutRedirecting: "Redirecting…",
  checkoutFailed: "Checkout failed",
  checkoutNetworkError: "Network error. Try again.",
  manageSubscription: "Manage subscription",
  portalFailed: "Could not open billing portal",
  portalNetworkError: "Network error",
  subscriptionStatus: {
    inactive: "Not subscribed",
    trialing: "Free trial",
    active: "Active",
    past_due: "Past due",
    canceled: "Canceled",
    unpaid: "Unpaid",
  },
  contactUs: "Contact us",
  needCustom: "Need a custom plan?",
  plans: {
    starter: {
      name: "Starter",
      description:
        "Try CrossTalent with one live job post on the board.",
      features: [
        "Company profile setup",
        "1 job post live for 10 days",
        "Candidate search during free access",
      ],
    },
    growth: {
      name: "Growth",
      description: "For teams hiring regularly across borders.",
      cta: "Start Growth",
      features: [
        "3 job posts live (30 days each)",
        "Full candidate search & filters",
        "Unlimited messaging",
        "Company profile on job board",
        "Email support",
      ],
    },
    scale: {
      name: "Scale",
      description: "For larger hiring programs and multiple roles.",
      cta: "Start Scale",
      features: [
        "10 job posts live (30 days each)",
        "Priority candidate search",
        "Unlimited messaging",
        "Dedicated onboarding",
        "Priority support",
      ],
    },
    single_post: {
      name: "Single post",
      description: "Post one role for 30 days — pay once, no subscription.",
      cta: "Post one job",
      features: [
        "1 job post live for 30 days",
        "Listed on the CrossTalent job board",
        "Apply via your external link",
        "No monthly commitment",
      ],
    },
  },
} as const;

import type { DeepString } from "@/i18n/types";

export type BillingMessages = DeepString<typeof billingEn>;
