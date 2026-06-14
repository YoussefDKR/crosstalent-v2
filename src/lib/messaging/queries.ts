import { createClient } from "@/lib/supabase/server";
import { hasAcceptedApplicationBetween } from "@/lib/messaging/access";
import type {
  ConversationListItem,
  ConversationThread,
  MessageItem,
  MessageRow,
} from "@/types/messaging";
import type { Profile } from "@/types";

function mapMessage(row: MessageRow, currentUserId: string): MessageItem {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    createdAt: row.created_at,
    isMine: row.sender_id === currentUserId,
  };
}

type ProfileSnippet = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
};

function displayNameForUser(
  p: ProfileSnippet,
  companyName: string | null | undefined
): { name: string; subtitle: string | null } {
  if (p.role === "employer") {
    const company = companyName?.trim();
    const person = p.full_name?.trim();
    return {
      name: company || person || p.email || "Employer",
      subtitle: company && person ? person : company ? "Employer" : null,
    };
  }
  return {
    name: p.full_name?.trim() || p.email || "Candidate",
    subtitle: null,
  };
}

async function profileNames(
  userIds: string[],
  viewerRole: Profile["role"]
): Promise<Map<string, { name: string; subtitle: string | null }>> {
  const supabase = await createClient();
  const unique = [...new Set(userIds)];
  if (unique.length === 0) return new Map();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .in("id", unique);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p as ProfileSnippet]));

  const employerIds =
    viewerRole === "candidate"
      ? unique
      : unique.filter((id) => profileById.get(id)?.role === "employer");

  const { data: companies } =
    employerIds.length > 0
      ? await supabase
          .from("company_profiles")
          .select("user_id, company_name")
          .in("user_id", employerIds)
      : { data: [] };

  const companyByEmployer = new Map(
    (companies ?? []).map((c) => [c.user_id, c.company_name])
  );

  return new Map(
    unique.map((id) => {
      const p = profileById.get(id);
      if (p) {
        return [id, displayNameForUser(p, companyByEmployer.get(id))] as const;
      }
      const company = companyByEmployer.get(id);
      if (company) {
        return [
          id,
          { name: company, subtitle: "Employer" },
        ] as const;
      }
      return [id, { name: "User", subtitle: null }] as const;
    })
  );
}

export async function listConversationsForUser(
  profile: Profile
): Promise<ConversationListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("conversations")
    .select("id, employer_id, candidate_id, updated_at")
    .order("updated_at", { ascending: false });

  if (profile.role === "employer") {
    query = query.eq("employer_id", profile.id);
  } else {
    query = query.eq("candidate_id", profile.id);
  }

  const { data: conversations, error } = await query;
  if (error || !conversations?.length) return [];

  const allowedConversations = [];
  for (const c of conversations) {
    const allowed = await hasAcceptedApplicationBetween(
      c.employer_id,
      c.candidate_id
    );
    if (allowed) allowedConversations.push(c);
  }

  if (allowedConversations.length === 0) return [];

  const otherIds = allowedConversations.map((c) =>
    profile.role === "employer" ? c.candidate_id : c.employer_id
  );
  const names = await profileNames(otherIds, profile.role);

  const conversationIds = allowedConversations.map((c) => c.id);
  const { data: recentMessages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });

  const lastByConversation = new Map<string, MessageRow>();
  for (const msg of recentMessages ?? []) {
    if (!lastByConversation.has(msg.conversation_id)) {
      lastByConversation.set(msg.conversation_id, msg as MessageRow);
    }
  }

  return allowedConversations.map((c) => {
    const otherId =
      profile.role === "employer" ? c.candidate_id : c.employer_id;
    const other = names.get(otherId);
    const last = lastByConversation.get(c.id);

    return {
      id: c.id,
      employerId: c.employer_id,
      candidateId: c.candidate_id,
      updatedAt: c.updated_at,
      otherPartyName: other?.name ?? "User",
      otherPartySubtitle: other?.subtitle ?? null,
      lastMessageBody: last?.body ?? null,
      lastMessageAt: last?.created_at ?? null,
      lastMessageIsMine: last ? last.sender_id === profile.id : false,
    };
  });
}

export async function getConversationThread(
  conversationId: string,
  profile: Profile
): Promise<ConversationThread | null> {
  const supabase = await createClient();

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("id, employer_id, candidate_id")
    .eq("id", conversationId)
    .maybeSingle();

  if (error || !conversation) return null;

  const isParticipant =
    conversation.employer_id === profile.id ||
    conversation.candidate_id === profile.id;
  if (!isParticipant) return null;

  const messagingAllowed = await hasAcceptedApplicationBetween(
    conversation.employer_id,
    conversation.candidate_id
  );
  if (!messagingAllowed) return null;

  const otherId =
    profile.role === "employer"
      ? conversation.candidate_id
      : conversation.employer_id;
  const names = await profileNames([otherId], profile.role);
  const other = names.get(otherId);

  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return {
    id: conversation.id,
    employerId: conversation.employer_id,
    candidateId: conversation.candidate_id,
    otherPartyName: other?.name ?? "User",
    otherPartySubtitle: other?.subtitle ?? null,
    messages: (messages ?? []).map((m) =>
      mapMessage(m as MessageRow, profile.id)
    ),
  };
}

export async function findConversationWithCandidate(
  employerId: string,
  candidateId: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("employer_id", employerId)
    .eq("candidate_id", candidateId)
    .maybeSingle();

  return data?.id ?? null;
}
