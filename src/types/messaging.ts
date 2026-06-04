export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ConversationRow = {
  id: string;
  employer_id: string;
  candidate_id: string;
  job_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationListItem = {
  id: string;
  employerId: string;
  candidateId: string;
  updatedAt: string;
  otherPartyName: string;
  otherPartySubtitle: string | null;
  lastMessageBody: string | null;
  lastMessageAt: string | null;
  lastMessageIsMine: boolean;
};

export type MessageItem = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  isMine: boolean;
};

export type ConversationThread = {
  id: string;
  employerId: string;
  candidateId: string;
  otherPartyName: string;
  otherPartySubtitle: string | null;
  messages: MessageItem[];
};
