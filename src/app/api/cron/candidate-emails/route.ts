import { NextResponse } from "next/server";
import { runCandidateEmailCampaigns } from "@/lib/candidate/email-campaigns";
import { isCronAuthorized } from "@/lib/cron/auth";
import { isContactEmailConfigured } from "@/config/contact";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 503 }
    );
  }

  if (!isContactEmailConfigured()) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 503 }
    );
  }

  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runCandidateEmailCampaigns();
  return NextResponse.json(summary);
}

export async function POST(request: Request) {
  return GET(request);
}
