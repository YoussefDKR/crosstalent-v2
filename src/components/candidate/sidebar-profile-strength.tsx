import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateProfileCompletion } from "@/lib/candidate/completion";
import { getCandidateProfileData } from "@/lib/candidate/queries";
import { getServerI18n } from "@/i18n/server";
import type { Profile } from "@/types";

type SidebarProfileStrengthProps = {
  profile: Profile;
};

export async function SidebarProfileStrength({
  profile,
}: SidebarProfileStrengthProps) {
  const { messages } = await getServerI18n();
  const c = messages.candidate;
  const data = await getCandidateProfileData(profile);
  const { percent } = calculateProfileCompletion(data);

  return (
    <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">{c.completionTitle}</span>
        <span className="font-semibold text-amber-400">{percent}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/60">
        {percent >= 80 ? c.completionStrong : c.sidebarAlmostThere}
      </p>
      <Link href="/candidate/profile" className="mt-4 block">
        <Button
          size="sm"
          className="w-full bg-white text-[#0F172A] hover:bg-white/90"
        >
          {c.improveProfile}
        </Button>
      </Link>
    </div>
  );
}
