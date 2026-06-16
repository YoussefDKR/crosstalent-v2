"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { removeCv, saveCvMetadata } from "@/app/candidate/actions";
import { CV_ACCEPT, CV_BUCKET, CV_MAX_BYTES } from "@/config/candidate";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

type CvUploadProps = {
  userId: string;
  cvFileName: string | null;
  cvUploadedAt: string | null;
  downloadUrl?: string | null;
};

export function CvUpload({
  userId,
  cvFileName,
  cvUploadedAt,
  downloadUrl,
}: CvUploadProps) {
  const { t, locale } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileName, setFileName] = useState(cvFileName);
  const [uploadedAt, setUploadedAt] = useState(cvUploadedAt);
  const [isPending, startTransition] = useTransition();

  async function handleUpload(file: File) {
    setError(null);
    setSuccess(null);

    if (file.size > CV_MAX_BYTES) {
      setError(t("candidate.profileForm.cvTooLarge"));
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx"].includes(ext)) {
      setError(t("candidate.profileForm.cvInvalidType"));
      return;
    }

    const path = `${userId}/cv.${ext}`;
    const supabase = createClient();

    const { error: uploadError } = await supabase.storage
      .from(CV_BUCKET)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const result = await saveCvMetadata(path, file.name);
    if (result.error) {
      setError(result.error);
      return;
    }

    setFileName(file.name);
    setUploadedAt(new Date().toISOString());
    setSuccess(result.success ?? t("candidate.actionMessages.cvUploaded"));
  }

  function handleRemove() {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      const result = await removeCv();
      if (result.error) {
        setError(result.error);
        return;
      }
      setFileName(null);
      setUploadedAt(null);
      setSuccess(result.success ?? t("candidate.actionMessages.cvRemoved"));
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-[#10B981]/10 px-3 py-2 text-sm text-[#047857]">
          {success}
        </p>
      )}

      {fileName ? (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
              <FileText className="size-5" />
            </span>
            <div>
              <p className="font-medium text-[#0F172A]">{fileName}</p>
              {uploadedAt && (
                <p className="text-xs text-muted-foreground">
                  {t("candidate.profileForm.cvUploadedOn", {
                    date: new Date(uploadedAt).toLocaleDateString(locale),
                  })}
                </p>
              )}
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-[#2563EB] hover:underline"
                >
                  {t("candidate.profileForm.cvPreviewDownload")}
                </a>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isPending}
            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            {t("candidate.profileForm.cvRemove")}
          </Button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-slate-50/50 px-6 py-10 transition-colors hover:border-[#2563EB]/40 hover:bg-[#2563EB]/5">
          <Upload className="size-8 text-muted-foreground" />
          <span className="mt-3 text-sm font-medium text-[#0F172A]">
            {t("candidate.profileForm.cvClickUpload")}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {t("candidate.profileForm.cvFormats")}
          </span>
          <input
            type="file"
            accept={CV_ACCEPT}
            className="sr-only"
            disabled={isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                startTransition(() => handleUpload(file));
              }
              e.target.value = "";
            }}
          />
        </label>
      )}

      {fileName && (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
          <Upload className="size-4" />
          {t("candidate.profileForm.cvReplace")}
          <input
            type="file"
            accept={CV_ACCEPT}
            className="sr-only"
            disabled={isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                startTransition(() => handleUpload(file));
              }
              e.target.value = "";
            }}
          />
        </label>
      )}

      {isPending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {t("candidate.profileForm.cvUploading")}
        </p>
      )}
    </div>
  );
}
