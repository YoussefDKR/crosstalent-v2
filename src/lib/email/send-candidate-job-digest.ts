import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import { locationLabel } from "@/lib/jobs/labels";
import {
  renderJobDigestEmail,
  type JobDigestContent,
} from "@/lib/email/candidate-templates";
import { siteConfig } from "@/config/site";

export type JobDigestPayload = JobDigestContent & {
  toEmail: string;
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

  const { subject, html } = renderJobDigestEmail(payload);
  const name = payload.firstName.trim() || "there";
  const appUrl = siteConfig.url.replace(/\/$/, "");
  const jobsUrl = `${appUrl}${siteConfig.links.jobs}`;
  const intro = payload.personalized
    ? "Here are new roles on CrossTalent that match the job alerts you set up:"
    : "Here are fresh remote and hybrid opportunities with European companies on CrossTalent this week:";

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
    subject,
    text,
    html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
