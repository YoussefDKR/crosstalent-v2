import Link from "next/link";
import { Briefcase, Users } from "lucide-react";
import { ApplicationListItem } from "@/components/home/application-list-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listEmployerApplications } from "@/lib/applications/queries";
import type { Profile } from "@/types";

type EmployerHomeProps = {
  profile: Profile;
};

export async function EmployerHome({ profile }: EmployerHomeProps) {
  const applications = await listEmployerApplications(profile.id);
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="bg-[#F8FAFC] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
              Applications
            </h1>
            <p className="mt-2 text-muted-foreground">
              Candidates who applied to your published jobs.
              {pendingCount > 0 && (
                <span className="ml-1 font-medium text-[#2563EB]">
                  {pendingCount} pending review
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/employer/jobs">
              <Button variant="outline" className="gap-2">
                <Briefcase className="size-4" />
                Job posts
              </Button>
            </Link>
            <Link href="/employer/candidates">
              <Button variant="outline" className="gap-2">
                <Users className="size-4" />
                Find talent
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
                Publish a job on the board and candidates can apply from the
                listing.
              </p>
              <Link href="/employer/jobs/new" className="mt-6 inline-block">
                <Button className="bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
                  Post a job
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
