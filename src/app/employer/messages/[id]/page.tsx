import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ThreadLayout } from "@/components/messaging/thread-layout";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { getConversationThread } from "@/lib/messaging/queries";
import { markConversationRead } from "@/lib/messaging/reads";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") return { title: "Messages" };
  const thread = await getConversationThread(id, profile);
  return { title: thread ? `Chat with ${thread.otherPartyName}` : "Messages" };
}

export default async function EmployerMessageThreadPage({ params }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const { id } = await params;
  const thread = await getConversationThread(id, profile);
  if (!thread) notFound();

  await markConversationRead(id, profile.id);

  return (
    <DashboardShell
      profile={profile}
      title="Messages"
      description={`Conversation with ${thread.otherPartyName}`}
    >
      <ThreadLayout profile={profile} thread={thread} />
    </DashboardShell>
  );
}
