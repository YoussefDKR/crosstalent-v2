import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  COMPANY_LOGO_PATH,
  IMAGE_UPLOAD_MAX_BYTES,
  PROFILE_IMAGES_BUCKET,
} from "@/config/images";
import { compressCompanyLogo } from "@/lib/images/compress";
import { removeStorageImageIfOwned } from "@/lib/images/storage";
import { uploadProfileImage } from "@/lib/images/upload-storage";
import { publicStorageUrl } from "@/lib/images/urls";
import { getCurrentProfile } from "@/lib/auth/session";
import { ensureCompanyProfileRow } from "@/lib/employer/queries";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be 8MB or smaller before upload." },
      { status: 400 }
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }

  try {
    await ensureCompanyProfileRow(profile.id);
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await compressCompanyLogo(buffer);
    const path = COMPANY_LOGO_PATH(profile.id);
    const supabase = await createClient();

    const { data: company } = await supabase
      .from("company_profiles")
      .select("logo_url")
      .eq("user_id", profile.id)
      .maybeSingle();

    await removeStorageImageIfOwned(company?.logo_url ?? null, profile.id);

    const { error: uploadError } = await uploadProfileImage(
      path,
      compressed,
      "image/webp"
    );

    if (uploadError) {
      return NextResponse.json({ error: uploadError }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("company_profiles")
      .update({ logo_url: path })
      .eq("user_id", profile.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePath("/employer/company");
    revalidatePath("/employer/dashboard");
    revalidatePath("/jobs", "layout");

    return NextResponse.json({
      path,
      url: publicStorageUrl(path),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not process image. Try a different file." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "employer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("company_profiles")
    .select("logo_url")
    .eq("user_id", profile.id)
    .maybeSingle();

  await removeStorageImageIfOwned(company?.logo_url ?? null, profile.id);

  const { error } = await supabase
    .from("company_profiles")
    .update({ logo_url: null })
    .eq("user_id", profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/employer/company");
  revalidatePath("/jobs", "layout");

  return NextResponse.json({ success: true });
}
