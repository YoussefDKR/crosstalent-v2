import { createAdminClient } from "@/lib/supabase/admin";

export type EmailLogType =
  | "profile_nudge"
  | "job_digest"
  | "application_new"
  | "application_accepted"
  | "application_rejected";

export async function logEmailSent(
  userId: string,
  emailType: EmailLogType,
  recipientEmail: string
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("candidate_email_log").insert({
    user_id: userId,
    email_type: emailType,
    recipient_email: recipientEmail,
  });
}
