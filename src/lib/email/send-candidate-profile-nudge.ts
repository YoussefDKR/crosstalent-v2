import { Resend } from "resend";
import { getContactFromEmail, isContactEmailConfigured } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { escapeHtml, renderCandidateEmail } from "@/lib/email/html";

export type ProfileNudgePayload = {
  toEmail: string;
  firstName: string;
  completionPercent: number;
  missingItems: string[];
};

export async function sendCandidateProfileNudge(
  payload: ProfileNudgePayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isContactEmailConfigured()) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const appUrl = siteConfig.url.replace(/\/$/, "");
  const profileUrl = `${appUrl}${siteConfig.links.candidateDashboard}`;
  const name = payload.firstName.trim() || "there";

  const missingList =
    payload.missingItems.length > 0
      ? `<ul style="margin:16px 0 0;padding-left:20px;color:#334155">${payload.missingItems
          .slice(0, 5)
          .map((item) => `<li style="margin:6px 0">${escapeHtml(item)}</li>`)
          .join("")}</ul>`
      : "";

  const bodyHtml = `
    <p style="margin:0 0 12px">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 12px">
      European employers on ${escapeHtml(siteConfig.name)} are actively reviewing candidate profiles.
      Yours is currently <strong>${payload.completionPercent}% complete</strong>.
    </p>
    <p style="margin:0 0 12px">
      Candidates with complete profiles — especially a strong headline, CV, and skills — are far more likely
      to be contacted for remote and hybrid roles across Europe.
    </p>
    ${
      missingList
        ? `<p style="margin:16px 0 8px;font-weight:600;color:#0f172a">A few items still to add:</p>${missingList}`
        : ""
    }
    <p style="margin:16px 0 0">It only takes a few minutes, and it meaningfully improves your visibility.</p>
  `;

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
    `Complete your profile: ${profileUrl}`,
  ].join("\n");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: getContactFromEmail(),
    to: [payload.toEmail],
    subject: `Complete your profile — stand out to European employers`,
    text,
    html: renderCandidateEmail({
      preheader: `Your profile is ${payload.completionPercent}% complete. A few updates can improve your chances.`,
      title: "Finish your profile for better opportunities",
      bodyHtml,
      ctaLabel: "Complete my profile",
      ctaUrl: profileUrl,
    }),
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
