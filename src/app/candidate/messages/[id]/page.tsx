import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ThreadLayout } from "@/components/messaging/thread-layout";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getConversationThread } from "@/lib/messaging/queries";
import { getServerI18n } from "@/i18n/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { t } = await getServerI18n();
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") {
    return { title: t("candidate.messagesTitle") };
  }
  const thread = await getConversationThread(id, profile);
  return {
    title: thread
      ? t("candidate.chatWith", { name: thread.otherPartyName })
      : t("candidate.messagesTitle"),
  };
}

export default async function CandidateMessageThreadPage({ params }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { t } = await getServerI18n();
  const { id } = await params;
  const thread = await getConversationThread(id, profile);
  if (!thread) notFound();

  return (
    <DashboardShell
      profile={profile}
      title={t("candidate.messagesTitle")}
      description={t("candidate.conversationWith", {
        name: thread.otherPartyName,
      })}
    >
      <ThreadLayout profile={profile} thread={thread} />
    </DashboardShell>
  );
}
