export type EmployerPlanId = "starter" | "growth" | "scale" | "single_post";

export type PlanBillingType = "subscription" | "one_time";

export type EmployerPlan = {
  id: EmployerPlanId;
  name: string;
  description: string;
  /** Subscription monthly price, or one-time price for single_post */
  price: number | null;
  billingType: PlanBillingType;
  /** Stripe Price ID — set in .env.local when Stripe is ready */
  stripePriceId: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
  publishedJobLimit: number;
  postDurationDays: number;
};

function priceId(envKey: string): string {
  return process.env[envKey]?.trim() ?? "";
}

export const STARTER_PLAN = {
  id: "starter" as const,
  name: "Starter",
  description: "Try CrossTalent with one live job post on the board.",
  price: 0,
  publishedJobLimit: 1,
  postDurationDays: 10,
  features: [
    "Company profile setup",
    "1 job post live for 10 days",
    "Candidate search during free access",
  ],
};

/** Paid subscriptions (monthly). */
export const EMPLOYER_PLANS: EmployerPlan[] = [
  {
    id: "growth",
    name: "Growth",
    description: "For teams hiring regularly across borders.",
    price: 199,
    billingType: "subscription",
    stripePriceId: priceId("STRIPE_PRICE_GROWTH"),
    highlighted: true,
    cta: "Start Growth",
    publishedJobLimit: 3,
    postDurationDays: 30,
    features: [
      "3 job posts live (30 days each)",
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
    price: 499,
    billingType: "subscription",
    stripePriceId: priceId("STRIPE_PRICE_SCALE"),
    cta: "Start Scale",
    publishedJobLimit: 10,
    postDurationDays: 30,
    features: [
      "10 job posts live (30 days each)",
      "Priority candidate search",
      "Unlimited messaging",
      "Dedicated onboarding",
      "Priority support",
    ],
  },
];

/** One-time purchase — no subscription. */
export const SINGLE_POST_PLAN: EmployerPlan = {
  id: "single_post",
  name: "Single post",
  description: "Post one role for 30 days — pay once, no subscription.",
  price: 79,
  billingType: "one_time",
  stripePriceId: priceId("STRIPE_PRICE_SINGLE_POST"),
  cta: "Post one job",
  publishedJobLimit: 1,
  postDurationDays: 30,
  features: [
    "1 job post live for 30 days",
    "Listed on the CrossTalent job board",
    "Apply via your external link",
    "No monthly commitment",
  ],
};

export const CHECKOUT_PLANS: EmployerPlan[] = [
  ...EMPLOYER_PLANS,
  SINGLE_POST_PLAN,
];

export const PUBLISHED_JOB_LIMITS: Record<EmployerPlanId, number> = {
  starter: STARTER_PLAN.publishedJobLimit,
  growth: 3,
  scale: 10,
  single_post: 1,
};

export const POST_DURATION_DAYS: Record<EmployerPlanId, number> = {
  starter: STARTER_PLAN.postDurationDays,
  growth: 30,
  scale: 30,
  single_post: 30,
};

export const TRIAL_PUBLISHED_JOB_LIMIT = STARTER_PLAN.publishedJobLimit;
export const TRIAL_DURATION_DAYS = STARTER_PLAN.postDurationDays;

export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "trialing",
  "active",
] as const;

export function getPlanById(planId: string): EmployerPlan | undefined {
  return CHECKOUT_PLANS.find((p) => p.id === planId);
}

export function postDurationDaysForPlan(planId: string): number {
  if (planId in POST_DURATION_DAYS) {
    return POST_DURATION_DAYS[planId as EmployerPlanId];
  }
  return POST_DURATION_DAYS.starter;
}
