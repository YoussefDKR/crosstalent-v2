import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { locationLabel, statusLabel } from "@/lib/jobs/labels";
import type { JobRow } from "@/types/jobs";
import { DeleteJobButton } from "./delete-job-button";
import { PublishJobButton } from "./publish-job-button";

type EmployerJobsListProps = {
  jobs: JobRow[];
};

function statusVariant(
  status: JobRow["status"]
): "default" | "secondary" | "outline" {
  if (status === "published") return "default";
  if (status === "closed") return "outline";
  return "secondary";
}

export function EmployerJobsList({ jobs }: EmployerJobsListProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-10 text-center">
        <p className="font-medium text-[#0F172A]">No job posts yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first role and publish it to appear on the public job board.
        </p>
        <Link href="/employer/jobs/new" className="mt-6 inline-block">
          <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
            Post a job
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-white shadow-sm">
      {jobs.map((job) => (
        <li
          key={job.id}
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[#0F172A]">{job.title}</h3>
              <Badge variant={statusVariant(job.status)}>
                {statusLabel(job.status)}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {locationLabel(job.location_city, job.location_country)}
            </p>
            {job.status === "draft" && (
              <p className="mt-2 text-xs text-amber-800 bg-amber-50 rounded-md px-2 py-1.5 inline-block">
                Not on the public job board — publish or set status to Published
                and save.
              </p>
            )}
            {job.status === "published" && (
              <Link
                href={`/jobs/${job.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
              >
                View on job board
                <ExternalLink className="size-3" />
              </Link>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {job.status === "draft" && <PublishJobButton jobId={job.id} />}
            <Link href={`/employer/jobs/${job.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="size-3.5" />
                Edit
              </Button>
            </Link>
            <DeleteJobButton jobId={job.id} jobTitle={job.title} />
          </div>
        </li>
      ))}
    </ul>
  );
}
