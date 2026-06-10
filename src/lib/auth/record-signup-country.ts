import { getCountryFromRequestHeaders } from "@/lib/geo/request-country";
import { createAdminClient } from "@/lib/supabase/admin";

/** Store signup country once per user (from Vercel/edge geo headers). */
export async function recordSignupCountry(userId: string): Promise<void> {
  const country = await getCountryFromRequestHeaders();
  if (!country) return;

  try {
    const supabase = createAdminClient();
    await supabase
      .from("profiles")
      .update({ signup_country: country })
      .eq("id", userId)
      .is("signup_country", null);
  } catch {
    // Non-blocking; geo headers may be unavailable locally.
  }
}
