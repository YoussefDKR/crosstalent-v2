import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Button } from "@/components/ui/button";
import { countryLabel } from "@/lib/employer/candidate-search";
import type { CandidateProfileData } from "@/types/candidate";

type ProfilePageHeaderProps = {
  data: CandidateProfileData;
};

export function ProfilePageHeader({ data }: ProfilePageHeaderProps) {
  const name = data.profile.fullName ?? "Your profile";
  const location =
    data.details?.location ||
    (data.details?.country_code
      ? countryLabel(data.details.country_code)
      : null);

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <ProfileAvatar
            pathOrUrl={data.profile.avatarUrl}
            name={name}
            size="lg"
            className="size-20 ring-4 ring-[#2563EB]/10"
          />
          <div>
            <h2 className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-[#0F172A]">
              {name}
              <BadgeCheck className="size-5 text-[#2563EB]" aria-label="Verified" />
            </h2>
            {data.details?.headline && (
              <p className="mt-1 text-[#2563EB]">{data.details.headline}</p>
            )}
            {location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {location}
              </p>
            )}
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              Available for work
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" type="button" disabled title="Coming soon">
            Preview public profile
          </Button>
          <Link href="/candidate/settings">
            <Button variant="outline">Account settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
