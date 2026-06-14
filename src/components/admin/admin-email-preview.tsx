import {
  renderJobDigestEmail,
  renderProfileNudgeEmail,
  SAMPLE_JOB_DIGEST,
  SAMPLE_PROFILE_NUDGE,
} from "@/lib/email/candidate-templates";

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

export function AdminEmailPreview() {
  const profileNudge = renderProfileNudgeEmail(SAMPLE_PROFILE_NUDGE);
  const jobDigest = renderJobDigestEmail(SAMPLE_JOB_DIGEST);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Candidate email previews</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is exactly what candidates receive. Real emails go out automatically every
          Monday at 09:00 UTC. Nothing sends from this page — it is preview only.
        </p>
      </div>

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
  );
}
