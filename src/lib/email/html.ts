import { siteConfig } from "@/config/site";
import { CONTACT_PUBLIC_EMAIL } from "@/config/contact";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getEmailLogoUrl(): string {
  const appUrl = siteConfig.url.replace(/\/$/, "");
  return `${appUrl}/images/logo-full.png`;
}

function emailLogoBlock(appUrl: string): string {
  const logoUrl = getEmailLogoUrl();
  return `
          <tr>
            <td style="padding:28px 32px 16px" align="center">
              <a href="${escapeHtml(appUrl)}" style="text-decoration:none">
                <img
                  src="${escapeHtml(logoUrl)}"
                  alt="${escapeHtml(siteConfig.name)}"
                  width="200"
                  style="display:block;max-width:200px;width:200px;height:auto;border:0;margin:0 auto"
                />
              </a>
            </td>
          </tr>`;
}

type EmailLayoutOptions = {
  preheader?: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaColor?: string;
  footerHtml?: string;
};

export function renderBrandedEmail({
  preheader,
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  ctaColor = "#2563EB",
  footerHtml,
}: EmailLayoutOptions): string {
  const appUrl = siteConfig.url.replace(/\/$/, "");
  const ctaBlock =
    ctaLabel && ctaUrl
      ? `
        <p style="margin:28px 0 8px">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${ctaColor};color:#ffffff;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">
            ${escapeHtml(ctaLabel)}
          </a>
        </p>`
      : "";

  const preheaderBlock = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>`
    : "";

  const defaultFooter = `
              <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b">
                Questions? <a href="mailto:${escapeHtml(CONTACT_PUBLIC_EMAIL)}" style="color:#2563EB">${escapeHtml(CONTACT_PUBLIC_EMAIL)}</a>
                · <a href="${escapeHtml(appUrl)}" style="color:#2563EB">${escapeHtml(siteConfig.name)}</a>
              </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  ${preheaderBlock}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:32px 16px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden">
          ${emailLogoBlock(appUrl)}
          <tr>
            <td style="padding:0 32px 8px">
              <h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:700;color:#0f172a;text-align:center">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;font-size:15px;line-height:1.65;color:#334155">
              ${bodyHtml}
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e2e8f0;background:#f8fafc">
              ${footerHtml ?? defaultFooter}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderCandidateEmail(options: Omit<EmailLayoutOptions, "footerHtml">): string {
  const appUrl = siteConfig.url.replace(/\/$/, "");

  return renderBrandedEmail({
    ...options,
    footerHtml: `
              <p style="margin:0;font-size:12px;line-height:1.6;color:#64748b">
                You are receiving this email because you have a ${escapeHtml(siteConfig.name)} candidate account.
                Questions? <a href="mailto:${escapeHtml(CONTACT_PUBLIC_EMAIL)}" style="color:#2563EB">${escapeHtml(CONTACT_PUBLIC_EMAIL)}</a>
              </p>
              <p style="margin:10px 0 0;font-size:12px;color:#94a3b8">
                <a href="${escapeHtml(appUrl + siteConfig.links.candidateSettings)}" style="color:#64748b">Account settings</a>
                · <a href="${escapeHtml(appUrl + siteConfig.links.jobs)}" style="color:#64748b">Browse jobs</a>
              </p>`,
  });
}
