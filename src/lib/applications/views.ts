import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getViewedApplicationIds(
  employerId: string,
  applicationIds: string[]
): Promise<Set<string>> {
  const viewed = new Set<string>();
  if (applicationIds.length === 0) return viewed;

  const supabase = await createClient();
  const { data } = await supabase
    .from("application_views")
    .select("application_id")
    .eq("employer_id", employerId)
    .in("application_id", applicationIds);

  for (const row of data ?? []) {
    viewed.add(row.application_id);
  }

  return viewed;
}

export async function markApplicationViewed(
  applicationId: string,
  employerId: string
): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("application_views")
    .select("application_id")
    .eq("application_id", applicationId)
    .eq("employer_id", employerId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("application_views")
      .update({ viewed_at: now })
      .eq("application_id", applicationId)
      .eq("employer_id", employerId);
  } else {
    await supabase.from("application_views").insert({
      application_id: applicationId,
      employer_id: employerId,
      viewed_at: now,
    });
  }

  [
    "/employer/dashboard",
    "/employer/applications",
    "/",
  ].forEach((path) => revalidatePath(path));
}
