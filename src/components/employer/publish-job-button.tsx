"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { publishJob } from "@/app/employer/jobs/actions";
import { Button } from "@/components/ui/button";

type PublishJobButtonProps = {
  jobId: string;
};

export function PublishJobButton({ jobId }: PublishJobButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handlePublish() {
    startTransition(async () => {
      const result = await publishJob(jobId);
      if (result.error) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      disabled={pending}
      onClick={handlePublish}
      className="gap-1.5 bg-[#10B981] text-white hover:bg-[#059669]"
    >
      <Globe className="size-3.5" />
      {pending ? "Publishing…" : "Publish to job board"}
    </Button>
  );
}
