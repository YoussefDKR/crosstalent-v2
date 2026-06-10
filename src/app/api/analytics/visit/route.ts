import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { VISITOR_COOKIE, VISITOR_COOKIE_MAX_AGE } from "@/config/analytics";
import { getCountryFromRequestHeaders } from "@/lib/geo/request-country";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let path = "/";
  try {
    const body = (await request.json()) as { path?: string };
    if (body.path?.startsWith("/") && !body.path.startsWith("//")) {
      path = body.path.slice(0, 200);
    }
  } catch {
    // ignore invalid body
  }

  const cookieStore = await cookies();
  const existingVisitor = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId =
    existingVisitor && existingVisitor.length <= 64
      ? existingVisitor
      : randomUUID();

  const country = await getCountryFromRequestHeaders();

  try {
    const supabase = createAdminClient();
    await supabase.from("site_visits").insert({
      visitor_id: visitorId,
      country_code: country,
      path,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const response = NextResponse.json({ ok: true });
  if (!existingVisitor) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: VISITOR_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}
