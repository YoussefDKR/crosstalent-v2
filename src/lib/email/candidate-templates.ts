import { siteConfig } from "@/config/site";
import { locationLabel } from "@/lib/jobs/labels";
import { escapeHtml, renderCandidateEmail } from "@/lib/email/html";
import type { JobWithCompany } from "@/types/jobs";

export type ProfileNudgeContent = {
  firstName: string;
  completionPercent: number;
  missingItems: string[];
};

export type JobDigestContent = {
  firstName: string;
  jobs: JobWithCompany[];
  personalized: boolean;
};

export function renderProfileNudgeEmail(content: ProfileNudgeContent): {
  subject: string;
  html: string;
} {
  const appUrl = siteConfig.url.replace(/\/$/, "");
  const profileUrl = `${appUrl}${siteConfig.links.candidateDashboard}`;
  const name = content.firstName.trim() || "there";

  const missingList =
    content.missingItems.length > 0
      ? `<ul style="margin:16px 0 0;padding-left:20px;color:#334155">${content.missingItems
          .slice(0, 5)
          .map((item) => `<li style="margin:6px 0">${escapeHtml(item)}</li>`)
          .join("")}</ul>`
      : "";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px">
      European employers on ${escapeHtml(siteConfig.name)} are actively reviewing candidate profiles.
      Yours is currently <strong>${content.completionPercent}% complete</strong>.
    </p>
    <p style="margin:0 0 12px">
      Candidates with complete profiles — especially a strong headline, CV, and skills — are far more likely
      to be contacted for remote and hybrid roles across Europe.
    </p>
    ${
      missingList
        ? `<p style="margin:16px 0 8px;font-weight:600;color:#0f172a">A few items still to add:</p>${missingList}`
        : ""
    }
    <p style="margin:16px 0 0">It only takes a few minutes, and it meaningfully improves your visibility.</p>
  `;

  return {
    subject: "Complete your profile — stand out to European employers",
    html: renderCandidateEmail({
      preheader: `Your profile is ${content.completionPercent}% complete. A few updates can improve your chances.`,
      title: "Finish your profile for better opportunities",
      bodyHtml,
      ctaLabel: "Complete my profile",
      ctaUrl: profileUrl,
    }),
  };
}

export function renderJobDigestEmail(content: JobDigestContent): {
  subject: string;
  html: string;
} {
  const appUrl = siteConfig.url.replace(/\/$/, "");
  const jobsUrl = `${appUrl}${siteConfig.links.jobs}`;
  const name = content.firstName.trim() || "there";

  const jobRows = content.jobs
    .map((job) => {
      const company = job.company_name ?? "European employer";
      const location = locationLabel(job.location_city, job.location_country);
      const jobUrl = `${appUrl}/jobs/${job.id}`;
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #e2e8f0">
            <a href="${escapeHtml(jobUrl)}" style="font-size:15px;font-weight:600;color:#2563EB;text-decoration:none">${escapeHtml(job.title)}</a>
            <p style="margin:4px 0 0;font-size:13px;color:#64748b">${escapeHtml(company)} · ${escapeHtml(location)}</p>
          </td>
        </tr>`;
    })
    .join("");

  const intro = content.personalized
    ? "Here are new roles on CrossTalent that match the job alerts you set up:"
    : "Here are fresh remote and hybrid opportunities with European companies on CrossTalent this week:";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 16px">${escapeHtml(intro)}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0">
      ${jobRows}
    </table>
    <p style="margin:16px 0 0;font-size:14px;color:#64748b">Apply early — strong profiles get noticed first.</p>
  `;

  return {
    subject: `${content.jobs.length} new ${content.jobs.length === 1 ? "role" : "roles"} on CrossTalent`,
    html: renderCandidateEmail({
      preheader: `${content.jobs.length} new opportunities waiting for you on CrossTalent.`,
      title: "New jobs you may like",
      bodyHtml,
      ctaLabel: "Browse all jobs",
      ctaUrl: jobsUrl,
    }),
  };
}

export const SAMPLE_PROFILE_NUDGE: ProfileNudgeContent = {
  firstName: "Youssef",
  completionPercent: 62,
  missingItems: [
    "CV / resume upload",
    "At least 3 skills",
    "Work experience",
    "Professional headline",
  ],
};

export const SAMPLE_JOB_DIGEST: JobDigestContent = {
  firstName: "Youssef",
  personalized: true,
  jobs: [
    {
      id: "sample-1",
      employer_id: null,
      source_type: "rss",
      external_url: null,
      external_source: "jobicy",
      external_guid: null,
      rss_company_name: "Monzo",
      title: "Customer Insight Analyst",
      description: "",
      requirements: null,
      employment_type: "full_time",
      experience_level: "mid",
      remote_type: "remote",
      location_city: null,
      location_country: "UK",
      salary_min: null,
      salary_max: null,
      salary_currency: null,
      skills: ["Data"],
      languages: [],
      status: "published",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_name: "Monzo",
      company_logo_url: null,
      headquarters_country: null,
    },
    {
      id: "sample-2",
      employer_id: null,
      source_type: "rss",
      external_url: null,
      external_source: "remotive",
      external_guid: null,
      rss_company_name: "GitLab",
      title: "Senior Frontend Engineer",
      description: "",
      requirements: null,
      employment_type: "full_time",
      experience_level: "senior",
      remote_type: "remote",
      location_city: null,
      location_country: "Germany",
      salary_min: null,
      salary_max: null,
      salary_currency: null,
      skills: ["React"],
      languages: [],
      status: "published",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_name: "GitLab",
      company_logo_url: null,
      headquarters_country: null,
    },
  ],
};
