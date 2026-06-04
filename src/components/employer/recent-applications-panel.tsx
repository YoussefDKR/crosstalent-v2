import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import {
  applicationDisplayStatus,
  applicationStatusBadgeClass,
  languageTagClass,
} from "@/lib/applications/display";
import type { EmployerRecentApplication } from "@/lib/employer/dashboard";
import { cn } from "@/lib/utils";

type RecentApplicationsPanelProps = {
  applications: EmployerRecentApplication[];
};

export function RecentApplicationsPanel({
  applications,
}: RecentApplicationsPanelProps) {
  return (
    <section className="rounded-2xl border border-border/80 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Recent applications
        </h2>
        <Link
          href="/employer/applications"
          className="text-sm font-medium text-[#2563EB] hover:underline"
        >
          View all
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          No applications yet.{" "}
          <Link href="/employer/jobs/new" className="font-medium text-[#2563EB]">
            Post a job
          </Link>{" "}
          to start receiving candidates.
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {applications.map((app) => (
            <li key={app.id}>
              <Link
                href={`/employer/applications/${app.id}`}
                className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80 sm:flex-nowrap"
              >
                <ProfileAvatar
                  pathOrUrl={app.candidateAvatarUrl}
                  name={app.candidateName}
                  size="md"
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#0F172A]">
                    {app.candidateName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {app.jobTitle}
                  </p>
                  {app.languages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {app.languages.slice(0, 4).map((lang) => (
                        <span
                          key={`${app.id}-${lang.language}`}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            languageTagClass(lang.language)
                          )}
                        >
                          {lang.language} {lang.proficiencyLabel}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 sm:ml-auto">
                  <span className="text-xs text-muted-foreground">
                    {app.postedLabel}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      applicationStatusBadgeClass(app.status)
                    )}
                  >
                    {applicationDisplayStatus(app.status)}
                  </span>
                </div>
                <ChevronRight className="hidden size-5 text-muted-foreground sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
