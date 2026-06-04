import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messaging/conversation-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/auth/session";
import { listConversationsForUser } from "@/lib/messaging/queries";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function EmployerMessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") redirect("/login");

  const conversations = await listConversationsForUser(profile);

  return (
    <DashboardShell
      profile={profile}
      title="Messages"
      description="Chat with candidates in real time."
    >
      <ConversationList conversations={conversations} role="employer" />
    </DashboardShell>
  );
}
