import Link from "next/link";
import { Building2, MapPin, Briefcase } from "lucide-react";
import { resolveImageUrl } from "@/lib/images/urls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  employmentLabel,
  experienceLabel,
  locationLabel,
  remoteLabel,
} from "@/lib/jobs/labels";
import { formatSalaryRange } from "@/lib/jobs/queries";
import type { JobWithCompany } from "@/types/jobs";

type JobCardProps = {
  job: JobWithCompany;
};

export function JobCard({ job }: JobCardProps) {
  const salary = formatSalaryRange(job);
  const logoUrl = resolveImageUrl(job.company_logo_url);

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full border-border/80 shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="size-full object-contain p-1"
                />
              ) : (
                <Building2 className="size-5 text-[#0F172A]" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#2563EB]">
                {job.company_name ?? "European employer"}
              </p>
              <h3 className="mt-1 font-semibold text-[#0F172A] line-clamp-2">
                {job.title}
              </h3>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">{remoteLabel(job.remote_type)}</Badge>
            <Badge variant="secondary">
              {employmentLabel(job.employment_type)}
            </Badge>
            <Badge variant="secondary">
              {experienceLabel(job.experience_level)}
            </Badge>
          </div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              {locationLabel(job.location_city, job.location_country)}
            </p>
            {salary && (
              <p className="flex items-center gap-2 font-medium text-[#0F172A]">
                <Briefcase className="size-4 shrink-0 text-muted-foreground" />
                {salary}
              </p>
            )}
          </div>

          {job.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-[#0F172A]"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
