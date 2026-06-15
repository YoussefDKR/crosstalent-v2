import type { JobWithCompany } from "@/types/jobs";
import { buildJobPostingJsonLd } from "@/lib/seo/job-posting";

type JobPostingJsonLdProps = {
  job: JobWithCompany;
};

export function JobPostingJsonLd({ job }: JobPostingJsonLdProps) {
  const jsonLd = buildJobPostingJsonLd(job);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
