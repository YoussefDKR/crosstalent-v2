import {
  renderJobDigestEmail,
  renderProfileNudgeEmail,
  SAMPLE_JOB_DIGEST,
  SAMPLE_PROFILE_NUDGE,
} from "@/lib/email/candidate-templates";
import { AdminEmailLogTable } from "@/components/admin/admin-email-log-table";
import type { AdminEmailLogRow, AdminEmailLogSummary } from "@/lib/admin/types";

type EmailPreviewFrameProps = {
  title: string;
  subject: string;
  html: string;
};

function EmailPreviewFrame({ title, subject, html }: EmailPreviewFrameProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Subject line: <span className="font-medium text-[#0F172A]">{subject}</span>
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <iframe
          title={title}
          srcDoc={html}
          className="h-[720px] w-full border-0 bg-[#f1f5f9]"
          sandbox=""
        />
      </div>
    </section>
  );
}

type AdminEmailPreviewProps = {
  logs: AdminEmailLogRow[];
  summary: AdminEmailLogSummary;
};

export function AdminEmailPreview({ logs, summary }: AdminEmailPreviewProps) {
  const profileNudge = renderProfileNudgeEmail(SAMPLE_PROFILE_NUDGE);
  const jobDigest = renderJobDigestEmail(SAMPLE_JOB_DIGEST);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Candidate emails</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Preview templates and review who received each automated send. Real
          emails go out every Monday at 09:00 UTC via the candidate-email cron.
        </p>
      </div>

      <AdminEmailLogTable logs={logs} summary={summary} />

      <div className="border-t border-border pt-10">
        <h2 className="text-lg font-semibold text-[#0F172A]">Template previews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Nothing sends from this section — preview only.
        </p>
        <div className="mt-8 space-y-8">
          <EmailPreviewFrame
            title="1. Profile completion reminder"
            subject={profileNudge.subject}
            html={profileNudge.html}
          />

          <EmailPreviewFrame
            title="2. Weekly new jobs digest"
            subject={jobDigest.subject}
            html={jobDigest.html}
          />
        </div>
      </div>
    </div>
  );
}
