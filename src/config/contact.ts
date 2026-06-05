/** Public address shown on the site */
export const CONTACT_PUBLIC_EMAIL = "contact@crosstalent.io";

/** Inbox where form submissions are delivered */
export function getContactInboxEmail(): string {
  return process.env.CONTACT_INBOX_EMAIL?.trim() || "contact@crosstalent.com";
}

export function getContactFromEmail(): string {
  return (
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    `CrossTalent <${CONTACT_PUBLIC_EMAIL}>`
  );
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}
