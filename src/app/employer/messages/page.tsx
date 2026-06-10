import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messaging/conversation-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getServerI18n } from "@/i18n/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { listConversationsForUser } from "@/lib/messaging/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("employer.messagesTitle") };
}

export default async function EmployerMessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { t } = await getServerI18n();
  const conversations = await listConversationsForUser(profile);

  return (
    <DashboardShell
      profile={profile}
      title={t("employer.messagesTitle")}
      description={t("employer.messagesSubtitle")}
    >
      <ConversationList conversations={conversations} role="employer" />
    </DashboardShell>
  );
}
