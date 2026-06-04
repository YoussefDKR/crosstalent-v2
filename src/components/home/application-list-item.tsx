import Link from "next/link";
import { Briefcase, ChevronRight } from "lucide-react";
import { applicationDisplayStatus } from "@/lib/applications/display";
import { applicationStatusBadgeClass } from "@/lib/applications/display";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { EmployerApplicationListItem } from "@/types/applications";
import { cn } from "@/lib/utils";


type ApplicationListItemProps = {
  application: EmployerApplicationListItem;
};

export function ApplicationListItem({ application }: ApplicationListItemProps) {
  return (
    <li>
      <Link href={`/employer/applications/${application.id}`}>
        <Card className="border-border/80 shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-5">
            <ProfileAvatar
              pathOrUrl={application.candidateAvatarUrl}
              name={application.candidateName}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0F172A]">
                  {application.candidateName}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    applicationStatusBadgeClass(application.status)
                  )}
                >
                  {applicationDisplayStatus(application.status)}
                </span>
              </div>
              {application.candidateHeadline && (
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {application.candidateHeadline}
                </p>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#2563EB]">
                <Briefcase className="size-3.5 shrink-0" />
                Applied to: {application.jobTitle}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
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
