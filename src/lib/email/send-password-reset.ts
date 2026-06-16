import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import { escapeHtml, renderBrandedEmail } from "@/lib/email/html";
import { siteConfig } from "@/config/site";

export type PasswordResetEmailContent = {
  subject: string;
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  footerNote: string;
};

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string,
  content: PasswordResetEmailContent
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return {
      ok: false,
      error:
        "Email is not configured yet. Please contact support at contact@crosstalent.io.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = getContactFromEmail();

  const text = [
    content.title,
    "",
    content.footerNote.replace(/<[^>]+>/g, ""),
    "",
    resetUrl,
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [toEmail],
    subject: content.subject,
    text,
    html: renderBrandedEmail({
      title: content.title,
      bodyHtml: `${content.bodyHtml}<p style="margin:12px 0 0;font-size:14px;color:#64748b">${content.footerNote}</p>`,
      ctaLabel: content.ctaLabel,
      ctaUrl: resetUrl,
    }),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
