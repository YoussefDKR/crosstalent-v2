import { siteConfig } from "@/config/site";
import { escapeHtml, renderBrandedEmail, renderCandidateEmail } from "@/lib/email/html";

export type NewApplicationEmployerContent = {
  employerName: string;
  candidateName: string;
  jobTitle: string;
  applicationUrl: string;
};

export type ApplicationStatusCandidateContent = {
  candidateName: string;
  jobTitle: string;
  companyName: string;
  applicationsUrl: string;
};

export function renderNewApplicationEmployerEmail(
  content: NewApplicationEmployerContent
): { subject: string; html: string } {
  const name = content.employerName.trim() || "there";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px">
      <strong>${escapeHtml(content.candidateName)}</strong> just applied to your role
      <strong>${escapeHtml(content.jobTitle)}</strong> on ${escapeHtml(siteConfig.name)}.
    </p>
    <p style="margin:0 0 12px">
      Review their profile, CV, and skills in your applications inbox.
    </p>
  `;

  return {
    subject: `New application — ${content.jobTitle}`,
    html: renderBrandedEmail({
      preheader: `${content.candidateName} applied to ${content.jobTitle}`,
      title: "New candidate application",
      bodyHtml,
      ctaLabel: "Review application",
      ctaUrl: content.applicationUrl,
    }),
  };
}

export function renderApplicationAcceptedEmail(
  content: ApplicationStatusCandidateContent
): { subject: string; html: string } {
  const name = content.candidateName.trim() || "there";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px">
      Good news — <strong>${escapeHtml(content.companyName)}</strong> has accepted your application
      for <strong>${escapeHtml(content.jobTitle)}</strong>.
    </p>
    <p style="margin:0 0 12px">
      You can now message the employer directly from your CrossTalent inbox.
    </p>
  `;

  return {
    subject: `Application accepted — ${content.jobTitle}`,
    html: renderCandidateEmail({
      preheader: `${content.companyName} accepted your application for ${content.jobTitle}`,
      title: "Your application was accepted",
      bodyHtml,
      ctaLabel: "View my applications",
      ctaUrl: content.applicationsUrl,
    }),
  };
}

export function renderApplicationRejectedEmail(
  content: ApplicationStatusCandidateContent
): { subject: string; html: string } {
  const name = content.candidateName.trim() || "there";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px">
      Thank you for applying to <strong>${escapeHtml(content.jobTitle)}</strong> at
      <strong>${escapeHtml(content.companyName)}</strong>.
    </p>
    <p style="margin:0 0 12px">
      The employer has decided not to move forward with your application at this time.
      Keep exploring — new roles are added regularly on ${escapeHtml(siteConfig.name)}.
    </p>
  `;

  return {
    subject: `Update on your application — ${content.jobTitle}`,
    html: renderCandidateEmail({
      preheader: `An update on your application to ${content.jobTitle}`,
      title: "Application update",
      bodyHtml,
      ctaLabel: "Browse more jobs",
      ctaUrl: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.links.jobs}`,
    }),
  };
}

export const SAMPLE_NEW_APPLICATION: NewApplicationEmployerContent = {
  employerName: "Marie",
  candidateName: "Youssef Benali",
  jobTitle: "Senior React Developer",
  applicationUrl: `${siteConfig.url.replace(/\/$/, "")}/employer/applications/sample-id`,
};

export const SAMPLE_APPLICATION_ACCEPTED: ApplicationStatusCandidateContent = {
  candidateName: "Youssef",
  jobTitle: "Senior React Developer",
  companyName: "Acme GmbH",
  applicationsUrl: `${siteConfig.url.replace(/\/$/, "")}/candidate/applications`,
};

export const SAMPLE_APPLICATION_REJECTED: ApplicationStatusCandidateContent = {
  candidateName: "Youssef",
  jobTitle: "Product Designer",
  companyName: "Studio Paris",
  applicationsUrl: `${siteConfig.url.replace(/\/$/, "")}/candidate/applications`,
};
