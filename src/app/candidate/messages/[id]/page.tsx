import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CandidateNav } from "@/components/candidate/candidate-nav";
import { ThreadLayout } from "@/components/messaging/thread-layout";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getConversationThread } from "@/lib/messaging/queries";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") return { title: "Messages" };
  const thread = await getConversationThread(id, profile);
  return { title: thread ? `Chat with ${thread.otherPartyName}` : "Messages" };
}

export default async function CandidateMessageThreadPage({ params }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "candidate") redirect("/login");

  const { id } = await params;
  const thread = await getConversationThread(id, profile);
  if (!thread) notFound();

  return (
    <DashboardShell
      profile={profile}
      title="Messages"
      description={`Conversation with ${thread.otherPartyName}`}
    >
      <CandidateNav />
      <ThreadLayout profile={profile} thread={thread} />
    </DashboardShell>
  );
}
