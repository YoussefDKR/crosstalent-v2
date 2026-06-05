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
  description: "Company profile and draft jobs. Start a free trial for hiring tools.",
  monthlyPrice: 0,
  features: [
    "Company profile setup",
    "Draft job posts",
    "30-day free trial: 1 live job + candidate search",
  ],
};

/** Max published jobs on the board per plan (null = unlimited). */
export const PUBLISHED_JOB_LIMITS: Record<
  EmployerPlanId | "starter",
  number | null
> = {
  starter: 0,
  growth: 5,
  scale: null,
};

export const TRIAL_PUBLISHED_JOB_LIMIT = 1;
export const TRIAL_DURATION_DAYS = 30;

export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
] as const;
