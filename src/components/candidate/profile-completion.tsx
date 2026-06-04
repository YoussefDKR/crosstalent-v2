import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileCompletion } from "@/types/candidate";
import { cn } from "@/lib/utils";

type ProfileCompletionCardProps = {
  completion: ProfileCompletion;
  compact?: boolean;
};

export function ProfileCompletionCard({
  completion,
  compact = false,
}: ProfileCompletionCardProps) {
  const { percent, items } = completion;

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className={cn(compact && "pb-2")}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg text-[#0F172A]">
              Profile strength
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {percent >= 80
                ? "Strong profile — employers can find you easily."
                : "Complete your profile to stand out to European employers."}
            </p>
          </div>
          <span className="text-3xl font-semibold tabular-nums text-[#2563EB]">
            {percent}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {!compact && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {item.done ? (
                  <CheckCircle2 className="size-4 shrink-0 text-[#10B981]" />
                ) : (
                  <Circle className="size-4 shrink-0 text-slate-300" />
                )}
                <span className={item.done ? "text-[#0F172A]" : undefined}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        )}

        {percent < 100 && (
          <div className="flex flex-wrap gap-2">
            <Link href="/candidate/profile">
              <Button
                variant="outline"
                className="gap-2 border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/5"
              >
                Career profile
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/candidate/settings">
              <Button variant="outline" className="text-muted-foreground">
                Account settings
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
