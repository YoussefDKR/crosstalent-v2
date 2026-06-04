export type EmployerPlanId = "starter" | "growth" | "scale";

export type EmployerPlan = {
  id: EmployerPlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  /** Stripe Price ID — set in .env.local when Stripe is ready */
  stripePriceId: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

function priceId(envKey: string): string {
  return process.env[envKey]?.trim() ?? "";
}

/** Paid plan price IDs from environment (empty until you configure Stripe). */
export const EMPLOYER_PLANS: EmployerPlan[] = [
  {
    id: "growth",
    name: "Growth",
    description: "For teams hiring regularly across borders.",
    monthlyPrice: 199,
    stripePriceId: priceId("STRIPE_PRICE_GROWTH"),
    highlighted: true,
    cta: "Start Growth",
    features: [
      "Up to 5 active job posts",
      "Full candidate search & filters",
      "Unlimited messaging",
      "Company profile on job board",
      "Email support",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: "For larger hiring programs and multiple roles.",
    monthlyPrice: 499,
    stripePriceId: priceId("STRIPE_PRICE_SCALE"),
    cta: "Start Scale",
    features: [
      "Unlimited job posts",
      "Priority candidate search",
      "Unlimited messaging",
      "Dedicated onboarding",
      "Priority support",
    ],
  },
];

export const STARTER_PLAN = {
  id: "starter" as const,
  name: "Starter",
  description: "Explore the platform before upgrading.",
  monthlyPrice: 0,
  features: [
    "1 draft job post",
    "Browse candidate profiles",
    "Company profile setup",
  ],
};

export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
] as const;
