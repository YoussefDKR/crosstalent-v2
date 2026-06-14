import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminEmailPreview } from "@/components/admin/admin-email-preview";
import { getCurrentProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Email previews — Admin",
};

export default async function AdminEmailPreviewPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  return (
    <AdminAppShell profile={profile}>
      <AdminEmailPreview />
    </AdminAppShell>
  );
}
