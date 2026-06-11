"use client";

import "react-easy-crop/react-easy-crop.css";
import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Loader2 } from "lucide-react";
import { blobToFile, getCroppedImageBlob } from "@/lib/images/crop";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";

type ImageCropDialogProps = {
  open: boolean;
  imageSrc: string;
  aspect: number;
  title: string;
  cropShape?: "rect" | "round";
  onClose: () => void;
  onConfirm: (file: File) => void;
};

export function ImageCropDialog({
  open,
  imageSrc,
  aspect,
  title,
  cropShape = "rect",
  onClose,
  onConfirm,
}: ImageCropDialogProps) {
  const { messages } = useI18n();
  const a = messages.account;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea, 0);
      const file = blobToFile(
        blob,
        aspect === 1 ? "cropped.jpg" : "cropped-logo.jpg"
      );
      onConfirm(file);
      onClose();
    } catch {
      alert(a.cropFailed);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-dialog-title"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="border-b border-border px-4 py-3">
          <h2 id="crop-dialog-title" className="font-semibold text-[#0F172A]">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{a.cropHint}</p>
        </div>

        <div className="relative h-[min(60vh,360px)] bg-[#0F172A]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-2 border-t border-border px-4 py-3">
          <label className="text-xs font-medium text-muted-foreground">
            {a.cropZoom}
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-4 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            {a.cropCancel}
          </Button>
          <Button
            type="button"
            disabled={saving || !croppedArea}
            onClick={handleConfirm}
            className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {a.cropProcessing}
              </>
            ) : (
              a.cropUseImage
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
