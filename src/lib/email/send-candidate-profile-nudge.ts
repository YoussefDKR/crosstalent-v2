import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import {
  renderProfileNudgeEmail,
  type ProfileNudgeContent,
} from "@/lib/email/candidate-templates";

export type ProfileNudgePayload = ProfileNudgeContent & {
  toEmail: string;
};

export async function sendCandidateProfileNudge(
  payload: ProfileNudgePayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const { subject, html } = renderProfileNudgeEmail(payload);
  const name = payload.firstName.trim() || "there";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.crosstalent.io";

  const text = [
    `Hi ${name},`,
    "",
    `Your CrossTalent profile is ${payload.completionPercent}% complete.`,
    "",
    "Complete profiles get more attention from verified European employers.",
    "",
    ...(payload.missingItems.length
      ? ["Still to add:", ...payload.missingItems.slice(0, 5).map((i) => `- ${i}`), ""]
      : []),
    `Complete your profile: ${appUrl}/candidate/dashboard`,
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
