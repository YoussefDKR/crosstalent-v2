import Link from "next/link";
import { FileText, MapPin } from "lucide-react";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { countryLabel } from "@/lib/employer/candidate-search";
import type { CandidateListItem } from "@/types/employer-search";

type CandidateCardProps = {
  candidate: CandidateListItem;
};

export function CandidateCard({ candidate }: CandidateCardProps) {
  const displayName = candidate.fullName ?? "Candidate";

  return (
    <Link href={`/employer/candidates/${candidate.id}`}>
      <Card className="h-full border-border/80 shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start gap-3">
            <ProfileAvatar
              pathOrUrl={candidate.avatarUrl}
              name={displayName}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[#0F172A]">{displayName}</h3>
              <p className="mt-0.5 text-sm text-[#2563EB] line-clamp-1">
                {candidate.headline ?? "No headline yet"}
              </p>
            </div>
            <Badge
              variant={candidate.completionPercent >= 60 ? "default" : "secondary"}
              className="shrink-0"
            >
              {candidate.completionPercent}%
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              {candidate.location ?? countryLabel(candidate.countryCode)}
            </span>
            {candidate.hasCv && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981]/10 px-2 py-0.5 text-xs font-medium text-[#047857]">
                <FileText className="size-3" />
                CV
              </span>
            )}
          </div>

          {candidate.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {candidate.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-[#0F172A]"
                >
                  {skill.name}
                </span>
              ))}
              {candidate.skills.length > 5 && (
                <span className="text-xs text-muted-foreground">
                  +{candidate.skills.length - 5}
                </span>
              )}
            </div>
          )}

          {candidate.languages.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground line-clamp-1">
              {candidate.languages.map((l) => l.language).join(" · ")}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
