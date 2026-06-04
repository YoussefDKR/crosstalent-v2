import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ApplicationListItem } from "@/components/home/application-list-item";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listEmployerApplications } from "@/lib/applications/queries";
import { getCurrentProfile } from "@/lib/auth/session";
import type { ApplicationStatus } from "@/types/applications";

export const metadata: Metadata = {
  title: "Applications",
};

type ApplicationsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function EmployerApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { status: statusParam } = await searchParams;
  const statusFilter =
    statusParam === "pending" ||
    statusParam === "accepted" ||
    statusParam === "rejected"
      ? (statusParam as ApplicationStatus)
      : null;

  let applications = await listEmployerApplications(profile.id);
  if (statusFilter) {
    applications = applications.filter((a) => a.status === statusFilter);
  }

  const title = statusFilter
    ? statusFilter === "pending"
      ? "In review"
      : statusFilter === "accepted"
        ? "Shortlisted"
        : "Declined"
    : "All applications";

  return (
    <DashboardShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A]">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/employer/applications">
            <Button variant={!statusFilter ? "default" : "outline"} size="sm">
              All
            </Button>
          </Link>
          <Link href="/employer/applications?status=pending">
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
            >
              In review
            </Button>
          </Link>
          <Link href="/employer/applications?status=accepted">
            <Button
              variant={statusFilter === "accepted" ? "default" : "outline"}
              size="sm"
            >
              Shortlisted
            </Button>
          </Link>
        </div>
      </div>

      {applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((app) => (
            <ApplicationListItem key={app.id} application={app} />
          ))}
        </ul>
      ) : (
        <Card className="border-dashed border-border shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="font-medium text-[#0F172A]">No applications yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Publish a job and candidates can apply from your listing.
            </p>
            <Link href="/employer/jobs/new" className="mt-6 inline-block">
              <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                Post a job
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
