import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/session";

/** Legacy URL from dashboard — send employers to search. */
export default async function CandidatesRedirectPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "employer") redirect("/employer/candidates");
  if (profile?.role === "candidate") redirect("/candidate/dashboard");
  redirect("/login?redirectTo=/employer/candidates");
}
