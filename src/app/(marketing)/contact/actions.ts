"use server";

import { sendContactEmail } from "@/lib/email/send-contact";

export type ContactFormState = {
  error?: string;
  success?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const honeypot = String(formData.get("companyWebsite") ?? "").trim();
  if (honeypot) {
    return { success: "Thanks — we'll get back to you soon." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!email || !message) {
    return { error: "Please enter your email and message." };
  }

  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (message.length < 10) {
    return { error: "Please write a bit more detail (at least 10 characters)." };
  }

  if (message.length > 5000) {
    return { error: "Message is too long. Please keep it under 5,000 characters." };
  }

  const result = await sendContactEmail({
    senderEmail: email,
    senderName: name || undefined,
    message,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  return {
    success: "Message sent. We'll reply to your email within one business day.",
  };
}
