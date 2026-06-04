import type { Metadata } from "next";
import { ForEmployersPage } from "@/components/landing/for-employers-page";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "For employers",
  description:
    "Hire North African talent with CrossTalent. Post jobs, search candidates, manage applications, and message finalists — with transparent pricing.",
};

export default async function ForEmployersRoute() {
  const profile = await getCurrentProfile();
  const employerSignedIn = profile?.role === "employer";

  return <ForEmployersPage employerSignedIn={employerSignedIn} />;
}
