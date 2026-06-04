import type { Metadata } from "next";
import { WhyCrossTalentPage } from "@/components/landing/why-crosstalent-page";

export const metadata: Metadata = {
  title: "Why CrossTalent",
  description:
    "Learn why CrossTalent connects North African professionals with European employers through remote-first hiring, trusted profiles, and in-platform messaging.",
};

export default function WhyCrossTalentRoute() {
  return <WhyCrossTalentPage />;
}
