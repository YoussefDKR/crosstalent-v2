import type { Metadata } from "next";
import { ForCandidatesPage } from "@/components/landing/for-candidates-page";

export const metadata: Metadata = {
  title: "For job seekers",
  description:
    "Find remote and hybrid roles with European companies. Create a free CrossTalent profile, apply to verified employers, and grow your career across borders.",
};

export default function ForCandidatesRoute() {
  return <ForCandidatesPage />;
}
