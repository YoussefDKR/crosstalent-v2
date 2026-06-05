import { Resend } from "resend";
import {
  getContactFromEmail,
  getContactInboxEmail,
  isContactEmailConfigured,
} from "@/config/contact";

export type ContactEmailPayload = {
  senderEmail: string;
  senderName?: string;
  message: string;
};

export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return {
      ok: false,
      error:
        "Contact email is not configured yet. Please email us directly at contact@crosstalent.io.",
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = getContactFromEmail();
  const to = getContactInboxEmail();
  const name = payload.senderName?.trim() || "Someone";
  const subject = `CrossTalent contact — ${name}`;

  const text = [
    `From: ${name} <${payload.senderEmail}>`,
    "",
    payload.message.trim(),
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.senderEmail,
    subject,
    text,
    html: `
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(payload.senderEmail)}&gt;</p>
      <p style="white-space:pre-wrap;margin-top:1rem">${escapeHtml(payload.message.trim())}</p>
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
