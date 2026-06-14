"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentProfile } from "@/lib/auth/session";
import { hasAcceptedApplicationBetween } from "@/lib/messaging/access";
import { findConversationWithCandidate } from "@/lib/messaging/queries";
import { persistConversationRead } from "@/lib/messaging/reads";
import { createClient } from "@/lib/supabase/server";

export type MessageActionResult = {
  error?: string;
};

const MESSAGE_PATHS = ["/employer/messages", "/candidate/messages"];

const NOTIFICATION_REVALIDATE_PATHS = [
  "/employer/dashboard",
  "/employer/messages",
  "/employer/applications",
  "/candidate/dashboard",
  "/candidate/messages",
  "/",
];

function revalidateMessagePaths() {
  MESSAGE_PATHS.forEach((p) => revalidatePath(p));
}

function revalidateNotifications() {
  NOTIFICATION_REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
}

export async function markConversationReadAction(
  conversationId: string
): Promise<void> {
  const profile = await getCurrentProfile();
  if (!profile) return;

  const supabase = await createClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, employer_id, candidate_id")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) return;

  const isParticipant =
    conversation.employer_id === profile.id ||
    conversation.candidate_id === profile.id;
  if (!isParticipant) return;

  const allowed = await hasAcceptedApplicationBetween(
    conversation.employer_id,
    conversation.candidate_id
  );
  if (!allowed) return;

  await persistConversationRead(conversationId, profile.id);
  revalidateNotifications();
}

export async function startConversationWithCandidate(
  candidateId: string
): Promise<never | MessageActionResult> {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "employer") {
      return { error: "Only employers can start conversations." };
    }

    const allowed = await hasAcceptedApplicationBetween(profile.id, candidateId);
    if (!allowed) {
      return {
        error:
          "Messaging opens after you accept a candidate's application.",
      };
    }

    const existing = await findConversationWithCandidate(
      profile.id,
      candidateId
    );
    if (existing) {
      redirect(`/employer/messages/${existing}`);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        employer_id: profile.id,
        candidate_id: candidateId,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        const retry = await findConversationWithCandidate(
          profile.id,
          candidateId
        );
        if (retry) redirect(`/employer/messages/${retry}`);
      }
      return { error: error.message };
    }

    revalidateMessagePaths();
    redirect(`/employer/messages/${data.id}`);
  } catch (e) {
    if (isRedirectError(e)) throw e;
    return { error: "Something went wrong." };
  }
}

export async function sendMessage(
  conversationId: string,
  _prev: MessageActionResult,
  formData: FormData
): Promise<MessageActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { error: "Not signed in." };

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Message cannot be empty." };
  if (body.length > 4000) return { error: "Message is too long." };

  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, employer_id, candidate_id")
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) return { error: "Conversation not found." };

  const isParticipant =
    conversation.employer_id === profile.id ||
    conversation.candidate_id === profile.id;
  if (!isParticipant) return { error: "Unauthorized." };

  const allowed = await hasAcceptedApplicationBetween(
    conversation.employer_id,
    conversation.candidate_id
  );
  if (!allowed) {
    return {
      error: "Messaging is only available for accepted applications.",
    };
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: profile.id,
    body,
  });

  if (error) return { error: error.message };

  revalidateMessagePaths();
  revalidatePath(
    profile.role === "employer"
      ? `/employer/messages/${conversationId}`
      : `/candidate/messages/${conversationId}`
  );

  return {};
}
