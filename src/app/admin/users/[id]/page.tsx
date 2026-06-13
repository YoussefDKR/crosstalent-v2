import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminAppShell } from "@/components/admin/admin-app-shell";
import { AdminUserProfileView } from "@/components/admin/admin-user-profile-view";
import { getCurrentProfile } from "@/lib/auth/session";
import { getAdminUserProfile } from "@/lib/admin/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getAdminUserProfile(id);
  return {
    title: data
      ? `${data.profile.full_name ?? "User"} — Admin`
      : "User — Admin",
  };
}

export default async function AdminUserProfilePage({ params }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/login");

  const { id } = await params;
  const data = await getAdminUserProfile(id);
  if (!data) notFound();

  return (
    <AdminAppShell profile={profile}>
      <AdminUserProfileView data={data} />
    </AdminAppShell>
  );
}
