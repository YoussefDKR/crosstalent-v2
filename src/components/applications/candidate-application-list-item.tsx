import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { applicationStatusBadgeClass } from "@/lib/applications/display";
import { resolveImageUrl } from "@/lib/images/urls";
import { Card, CardContent } from "@/components/ui/card";
import type { CandidateApplicationListItem } from "@/types/applications";
import { cn } from "@/lib/utils";

type CandidateApplicationListItemProps = {
  application: CandidateApplicationListItem;
  statusLabel: string;
  appliedOnLabel: string;
};

export function CandidateApplicationListItemCard({
  application,
  statusLabel,
  appliedOnLabel,
}: CandidateApplicationListItemProps) {
  const logoUrl = resolveImageUrl(application.companyLogoUrl);
  const companyName = application.companyName ?? "Company";

  return (
    <li>
      <Link href={`/jobs/${application.jobId}`}>
        <Card className="border-border/80 shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="size-full object-contain p-1.5"
                />
              ) : (
                <Building2 className="size-6 text-[#0F172A]" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0F172A]">
                  {application.jobTitle}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    applicationStatusBadgeClass(application.status)
                  )}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {companyName}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {appliedOnLabel}{" "}
                {new Date(application.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </p>
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}
