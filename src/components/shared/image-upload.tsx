"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { ImageCropDialog } from "@/components/shared/image-crop-dialog";
import { IMAGE_ACCEPT } from "@/config/images";
import { resolveImageUrl } from "@/lib/images/urls";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  kind: "avatar" | "logo";
  uploadUrl: string;
  pathOrUrl: string | null;
  displayName?: string | null;
  label: string;
  hint?: string;
};

export function ImageUpload({
  kind,
  uploadUrl,
  pathOrUrl,
  displayName,
  label,
  hint,
}: ImageUploadProps) {
  const { messages } = useI18n();
  const a = messages.account;
  const displayHint = hint ?? a.uploadHint;
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(
    resolveImageUrl(pathOrUrl)
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    };
  }, [cropSrc]);

  async function upload(file: File) {
    setError(null);
    setSuccess(null);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(uploadUrl, { method: "POST", body: fd });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? a.uploadFailed);
      return;
    }

    setPreview(data.url ?? resolveImageUrl(data.path));
    setSuccess(kind === "avatar" ? a.avatarUpdated : a.logoUpdated);
    router.refresh();
  }

  function openCropper(file: File) {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
  }

  function closeCropper() {
    setCropOpen(false);
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  function remove() {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      const res = await fetch(uploadUrl, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? a.removeFailed);
        return;
      }
      setPreview(null);
      setSuccess(kind === "avatar" ? a.avatarRemoved : a.logoRemoved);
      router.refresh();
    });
  }

  const aspect = kind === "avatar" ? 1 : 1;
  const cropShape = kind === "avatar" ? "round" : "rect";

  return (
    <div className="space-y-4">
      {cropSrc && (
        <ImageCropDialog
          open={cropOpen}
          imageSrc={cropSrc}
          aspect={aspect}
          cropShape={cropShape}
          title={kind === "avatar" ? a.cropAvatar : a.cropLogo}
          onClose={closeCropper}
          onConfirm={(file) => {
            startTransition(() => upload(file));
          }}
        />
      )}

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {kind === "avatar" ? (
          <ProfileAvatar
            pathOrUrl={preview ?? pathOrUrl}
            name={displayName}
            size="lg"
          />
        ) : (
          <span
            className={cn(
              "relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white",
              preview && "p-1"
            )}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={a.companyLogoAlt}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <ImagePlus className="size-8 text-muted-foreground" />
            )}
          </span>
        )}

        <div className="flex flex-1 flex-col gap-2">
          <p className="text-sm font-medium text-[#0F172A]">{label}</p>
          <p className="text-xs text-muted-foreground">{displayHint}</p>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
              <ImagePlus className="size-4" />
              {preview ? a.replace : a.upload}
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                className="sr-only"
                disabled={pending}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) openCropper(file);
                  e.target.value = "";
                }}
              />
            </label>
            {preview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={remove}
                className="gap-1.5 text-red-600 hover:bg-red-50"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                {a.remove}
              </Button>
            )}
          </div>
        </div>
      </div>

      {pending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {a.uploading}
        </p>
      )}
    </div>
  );
}
