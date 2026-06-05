import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
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
    html: `
      <p>You requested to delete your <strong>${escapeHtml(siteConfig.name)}</strong> account.</p>
      <p>This action is <strong>permanent</strong>. Your profile, messages, and applications will be removed.</p>
      <p style="margin:1.5rem 0">
        <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">
          Confirm account deletion
        </a>
      </p>
      <p style="font-size:14px;color:#64748b">This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
