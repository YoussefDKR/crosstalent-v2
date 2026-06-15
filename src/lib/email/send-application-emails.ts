import { Resend } from "resend";
import { siteConfig } from "@/config/site";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import {
  renderApplicationAcceptedEmail,
  renderApplicationRejectedEmail,
  renderNewApplicationEmployerEmail,
  type ApplicationStatusCandidateContent,
  type NewApplicationEmployerContent,
} from "@/lib/email/application-templates";

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: getContactFromEmail(),
    to: [payload.to],
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function sendNewApplicationToEmployer(
  content: NewApplicationEmployerContent & { toEmail: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, html } = renderNewApplicationEmployerEmail(content);
  const name = content.employerName.trim() || "there";

  const text = [
    `Hi ${name},`,
    "",
    `${content.candidateName} just applied to your role "${content.jobTitle}" on ${siteConfig.name}.`,
    "",
    `Review application: ${content.applicationUrl}`,
  ].join("\n");

  return sendEmail({
    to: content.toEmail,
    subject,
    html,
    text,
  });
}

export async function sendApplicationAcceptedToCandidate(
  content: ApplicationStatusCandidateContent & { toEmail: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, html } = renderApplicationAcceptedEmail(content);
  const name = content.candidateName.trim() || "there";

  const text = [
    `Hi ${name},`,
    "",
    `Good news — ${content.companyName} has accepted your application for "${content.jobTitle}".`,
    "",
    `View applications: ${content.applicationsUrl}`,
  ].join("\n");

  return sendEmail({
    to: content.toEmail,
    subject,
    html,
    text,
  });
}

export async function sendApplicationRejectedToCandidate(
  content: ApplicationStatusCandidateContent & { toEmail: string }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { subject, html } = renderApplicationRejectedEmail(content);
  const name = content.candidateName.trim() || "there";
  const jobsUrl = `${siteConfig.url.replace(/\/$/, "")}${siteConfig.links.jobs}`;

  const text = [
    `Hi ${name},`,
    "",
    `Thank you for applying to "${content.jobTitle}" at ${content.companyName}.`,
    "The employer has decided not to move forward at this time.",
    "",
    `Browse more jobs: ${jobsUrl}`,
  ].join("\n");

  return sendEmail({
    to: content.toEmail,
    subject,
    html,
    text,
  });
}
