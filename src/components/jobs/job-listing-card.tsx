import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { resolveImageUrl } from "@/lib/images/urls";
import {
  employmentLabel,
  remoteLabel,
} from "@/lib/jobs/labels";
import {
  companyInitials,
  companyLogoColorClass,
  countryFlagEmoji,
  countryLabelFromCode,
  formatJobPostedAt,
} from "@/lib/jobs/format";
import { formatSalaryRange } from "@/lib/jobs/queries";
import { Button } from "@/components/ui/button";
import type { JobWithCompany } from "@/types/jobs";

type JobListingCardProps = {
  job: JobWithCompany;
};

export function JobListingCard({ job }: JobListingCardProps) {
  const salary = formatSalaryRange(job);
  const logoUrl = resolveImageUrl(job.company_logo_url);
  const company = job.company_name ?? "European employer";
  const posted = formatJobPostedAt(job.published_at ?? job.created_at);
  const countryCode = job.location_country;
  const countryName = countryLabelFromCode(countryCode);
  const flag = countryFlagEmoji(countryCode);

  return (
    <article className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className={`flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white ${companyLogoColorClass(company)}`}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="size-full object-contain bg-white p-2"
            />
          ) : (
            companyInitials(company)
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-[#0F172A]">{job.title}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <span>{company}</span>
                <BadgeCheck className="size-4 text-[#2563EB]" aria-hidden />
                <span className="text-xs font-medium text-[#2563EB]">Verified</span>
              </p>
            </div>
            <div className="text-right">
              {salary && (
                <p className="text-sm font-semibold text-[#0F172A]">{salary}</p>
              )}
              {posted && (
                <p className="mt-0.5 text-xs text-muted-foreground">{posted}</p>
              )}
            </div>
          </div>

          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              {remoteLabel(job.remote_type)} ({employmentLabel(job.employment_type)})
            </span>
            {countryName && (
              <>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1">
                  {flag && <span aria-hidden>{flag}</span>}
                  {countryName}
                </span>
              </>
            )}
            {job.location_city && (
              <>
                <MapPin className="size-3.5" />
                <span>{job.location_city}</span>
              </>
            )}
          </p>

          {(job.languages.length > 0 || job.skills.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {job.languages.slice(0, 3).map((lang) => (
                <span
                  key={`lang-${lang}`}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#0F172A]/80"
                >
                  {lang}
                </span>
              ))}
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-[#0F172A]/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-end border-t border-border/60 pt-4">
        <Link href={`/jobs/${job.id}`}>
          <Button className="bg-[#2563EB] px-6 text-white hover:bg-[#1d4ed8]">
            View &amp; apply
          </Button>
        </Link>
      </div>
    </article>
  );
}
