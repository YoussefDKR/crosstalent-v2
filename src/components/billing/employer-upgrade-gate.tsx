import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRIAL_DURATION_DAYS, TRIAL_PUBLISHED_JOB_LIMIT } from "@/config/billing";
import type { EmployerFeatureAccess } from "@/types/billing";

type EmployerUpgradeGateProps = {
  title: string;
  description: string;
  access?: EmployerFeatureAccess;
  variant?: "candidates" | "publish";
};

export function EmployerUpgradeGate({
  title,
  description,
  access,
  variant = "candidates",
}: EmployerUpgradeGateProps) {
  const trialHint =
    variant === "candidates"
      ? `Your free ${TRIAL_DURATION_DAYS}-day trial includes full candidate search.`
      : `Your free trial includes ${TRIAL_PUBLISHED_JOB_LIMIT} published job on the board.`;

  return (
    <div className="rounded-2xl border border-dashed border-[#2563EB]/30 bg-gradient-to-br from-[#EFF6FF] to-white p-10 text-center shadow-sm">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
        {access?.isTrialActive ? (
          <Sparkles className="size-7" />
        ) : (
          <Lock className="size-7" />
        )}
      </span>
      <h2 className="mt-5 text-xl font-semibold text-[#0F172A]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {access?.isTrialActive && access.trialDaysRemaining != null && (
        <p className="mt-3 text-sm font-medium text-[#2563EB]">
          Trial active · {access.trialDaysRemaining} day
          {access.trialDaysRemaining === 1 ? "" : "s"} left
        </p>
      )}
      {!access?.isTrialActive && !access?.hasPaidSubscription && (
        <p className="mt-3 text-sm text-muted-foreground">{trialHint}</p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/employer/billing">
          <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            {access?.hasPaidSubscription ? "Manage plan" : "View plans & trial"}
          </Button>
        </Link>
        <Link href="/employer/jobs">
          <Button variant="outline">Back to jobs</Button>
        </Link>
      </div>
    </div>
  );
}
