import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messaging/conversation-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { listConversationsForUser } from "@/lib/messaging/queries";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("candidate.messagesTitle") };
}

export default async function CandidateMessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t } = await getServerI18n();
  const conversations = await listConversationsForUser(profile);

  return (
    <DashboardShell
      profile={profile}
      title={t("candidate.messagesTitle")}
      description={t("candidate.messagesListDesc")}
    >
      <ConversationList conversations={conversations} role="candidate" />
    </DashboardShell>
  );
}
