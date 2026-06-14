import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import { escapeHtml, renderBrandedEmail } from "@/lib/email/html";
import { siteConfig } from "@/config/site";

export async function sendAccountDeletionEmail(
  toEmail: string,
  confirmUrl: string
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
  const subject = `Confirm account deletion — ${siteConfig.name}`;

  const text = [
    `You requested to delete your ${siteConfig.name} account.`,
    "",
    "This action is permanent. Your profile, messages, and applications will be removed.",
    "",
    `Confirm deletion: ${confirmUrl}`,
    "",
    "This link expires in 24 hours. If you did not request this, you can ignore this email.",
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [toEmail],
    subject,
    text,
    html: renderBrandedEmail({
      title: "Confirm account deletion",
      bodyHtml: `
        <p style="margin:0 0 12px">You requested to delete your <strong>${escapeHtml(siteConfig.name)}</strong> account.</p>
        <p style="margin:0 0 12px">This action is <strong>permanent</strong>. Your profile, messages, and applications will be removed.</p>
        <p style="margin:0 0 12px;font-size:14px;color:#64748b">This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
      `,
      ctaLabel: "Confirm account deletion",
      ctaUrl: confirmUrl,
      ctaColor: "#dc2626",
    }),
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
