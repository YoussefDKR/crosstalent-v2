import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { locationLabel } from "@/lib/jobs/labels";
import { escapeHtml, renderCandidateEmail } from "@/lib/email/html";
import type { JobWithCompany } from "@/types/jobs";

export type JobDigestPayload = {
  toEmail: string;
  firstName: string;
  jobs: JobWithCompany[];
  personalized: boolean;
};

export async function sendCandidateJobDigest(
  payload: JobDigestPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  if (payload.jobs.length === 0) {
    return { ok: false, error: "No jobs to include" };
  }

  const appUrl = siteConfig.url.replace(/\/$/, "");
  const jobsUrl = `${appUrl}${siteConfig.links.jobs}`;
  const name = payload.firstName.trim() || "there";

  const jobRows = payload.jobs
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

  const intro = payload.personalized
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

  const text = [
    `Hi ${name},`,
    "",
    intro,
    "",
    ...payload.jobs.map((job) => {
      const company = job.company_name ?? "European employer";
      const location = locationLabel(job.location_city, job.location_country);
      return `• ${job.title} — ${company} (${location})\n  ${appUrl}/jobs/${job.id}`;
    }),
    "",
    `Browse all jobs: ${jobsUrl}`,
  ].join("\n");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: getContactFromEmail(),
    to: [payload.toEmail],
    subject: `${payload.jobs.length} new ${payload.jobs.length === 1 ? "role" : "roles"} on CrossTalent`,
    text,
    html: renderCandidateEmail({
      preheader: `${payload.jobs.length} new opportunities waiting for you on CrossTalent.`,
      title: "New jobs you may like",
      bodyHtml,
      ctaLabel: "Browse all jobs",
      ctaUrl: jobsUrl,
    }),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
