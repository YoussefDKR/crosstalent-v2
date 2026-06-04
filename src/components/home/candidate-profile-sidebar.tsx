import Link from "next/link";
import { ArrowRight, UserCircle } from "lucide-react";
import { ProfileCompletionCard } from "@/components/candidate/profile-completion";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculateProfileCompletion } from "@/lib/candidate/completion";
import { getCandidateProfileData } from "@/lib/candidate/queries";
import type { Profile } from "@/types";

type CandidateProfileSidebarProps = {
  profile: Profile;
};

export async function CandidateProfileSidebar({
  profile,
}: CandidateProfileSidebarProps) {
  const data = await getCandidateProfileData(profile);
  const completion = calculateProfileCompletion(data);

  return (
    <Card className="sticky top-24 border-border/80 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatar
            pathOrUrl={data.profile.avatarUrl}
            name={data.profile.fullName}
            size="lg"
            className="size-20"
          />
          <h2 className="mt-4 text-lg font-semibold text-[#0F172A]">
            {data.profile.fullName ?? "Your profile"}
          </h2>
          {data.details?.headline && (
            <p className="mt-1 text-sm text-[#2563EB] line-clamp-2">
              {data.details.headline}
            </p>
          )}
        </div>

        <div className="mt-6">
          <ProfileCompletionCard completion={completion} compact />
        </div>

        <div className="mt-6 space-y-2">
          <Link href="/candidate/dashboard">
            <Button
              variant="outline"
              className="w-full gap-2"
            >
              <UserCircle className="size-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/candidate/profile">
            <Button className="w-full gap-2 bg-[#2563EB] text-white hover:bg-[#1d4ed8]">
              Edit profile
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
