import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminEmailPreview } from "@/components/admin/admin-email-preview";
import { getCurrentProfile } from "@/lib/auth/session";
import {
  getCandidateEmailLogSummary,
  listCandidateEmailLog,
} from "@/lib/admin/queries";

export const metadata: Metadata = {
  title: "Emails — Admin",
};

export default async function AdminEmailPreviewPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const [logs, summary] = await Promise.all([
    listCandidateEmailLog(),
    getCandidateEmailLogSummary(),
  ]);

  return (
    <AdminAppShell profile={profile}>
      <AdminEmailPreview logs={logs} summary={summary} />
    </AdminAppShell>
  );
}
