import { siteConfig } from "@/config/site";
import { resolveImageUrl } from "@/lib/images/urls";
import { locationLabel } from "@/lib/jobs/labels";
import type { EmploymentType, JobWithCompany, RemoteType } from "@/types/jobs";

const EMPLOYMENT_SCHEMA: Record<EmploymentType, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
};

function plainDescription(text: string, max = 5000): string {
  return text.replace(/\s+/g, " ").trim().slice(0, max);
}

export function metaDescriptionFromJob(job: JobWithCompany, max = 160): string {
  const company = job.company_name ?? "European employer";
  const location = locationLabel(job.location_city, job.location_country);
  const prefix = `${job.title} at ${company} — ${location}. `;
  const body = plainDescription(job.description);
  const available = max - prefix.length;
  if (available <= 0) return prefix.trim();
  if (body.length <= available) return prefix + body;
  return prefix + body.slice(0, available - 1).trimEnd() + "…";
}

export function buildJobPostingJsonLd(
  job: JobWithCompany
): Record<string, unknown> {
  const appUrl = siteConfig.url.replace(/\/$/, "");
  const companyName = job.company_name ?? "European employer";
  const description = plainDescription(job.description);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.name,
      value: job.id,
    },
    datePosted: job.published_at ?? job.created_at,
    validThrough: job.expires_at ?? undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      ...(resolveImageUrl(job.company_logo_url)
        ? { logo: resolveImageUrl(job.company_logo_url) }
        : {}),
    },
    employmentType: EMPLOYMENT_SCHEMA[job.employment_type],
    url: `${appUrl}/jobs/${job.id}`,
  };

  if (job.salary_min || job.salary_max) {
    jsonLd.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salary_currency ?? "EUR",
      value: {
        "@type": "QuantitativeValue",
        ...(job.salary_min ? { minValue: job.salary_min } : {}),
        ...(job.salary_max ? { maxValue: job.salary_max } : {}),
        unitText: "YEAR",
      },
    };
  }

  const remoteType = job.remote_type as RemoteType;
  if (remoteType === "remote") {
    jsonLd.jobLocationType = "TELECOMMUTE";
    jsonLd.applicantLocationRequirements = {
      "@type": "Country",
      name: job.location_country ?? "Worldwide",
    };
  } else if (job.location_city || job.location_country) {
    jsonLd.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        ...(job.location_country ? { addressCountry: job.location_country } : {}),
      },
    };
  }

  return jsonLd;
}
