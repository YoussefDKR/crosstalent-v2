"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleSavedJob } from "@/app/candidate/job-board-actions";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import { cn } from "@/lib/utils";

type SaveJobButtonProps = {
  jobId: string;
  initialSaved?: boolean;
  variant?: "icon" | "default";
  className?: string;
};

export function SaveJobButton({
  jobId,
  initialSaved = false,
  variant = "default",
  className,
}: SaveJobButtonProps) {
  const { t } = useI18n();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleSavedJob(jobId);
      if (result.saved !== undefined) {
        setSaved(result.saved);
      }
    });
  }

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("shrink-0", className)}
        disabled={pending}
        onClick={handleClick}
        title={saved ? t("jobs.unsaveJob") : t("jobs.saveJob")}
        aria-pressed={saved}
      >
        <Bookmark
          className={cn("size-4", saved && "fill-[#2563EB] text-[#2563EB]")}
        />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("gap-2", className)}
      disabled={pending}
      onClick={handleClick}
    >
      <Bookmark
        className={cn("size-4", saved && "fill-[#2563EB] text-[#2563EB]")}
      />
      {saved ? t("jobs.saved") : t("jobs.saveJob")}
    </Button>
  );
}
