import { NextResponse } from "next/server";
import {
  CANDIDATE_AVATAR_PATH,
  IMAGE_UPLOAD_MAX_BYTES,
} from "@/config/images";
import { compressAvatar } from "@/lib/images/compress";
import { removeStorageImageIfOwned } from "@/lib/images/storage";
import { uploadProfileImage } from "@/lib/images/upload-storage";
import { publicStorageUrl } from "@/lib/images/urls";
import { getCurrentProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "candidate" && profile.role !== "employer")) {
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
    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await compressAvatar(buffer);
    const path = CANDIDATE_AVATAR_PATH(profile.id);
    const supabase = await createClient();

    await removeStorageImageIfOwned(profile.avatarUrl, profile.id);

    const { error: uploadError } = await uploadProfileImage(
      path,
      compressed,
      "image/webp"
    );

    if (uploadError) {
      return NextResponse.json({ error: uploadError }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate/settings");
    revalidatePath("/candidate/dashboard");
    revalidatePath("/employer/settings");
    revalidatePath("/employer/dashboard");
    revalidatePath("/employer/candidates", "layout");

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
  if (!profile || (profile.role !== "candidate" && profile.role !== "employer")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await removeStorageImageIfOwned(profile.avatarUrl, profile.id);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/candidate/profile");
  revalidatePath("/candidate/settings");
  revalidatePath("/candidate/dashboard");
  revalidatePath("/employer/settings");
  revalidatePath("/employer/dashboard");

  return NextResponse.json({ success: true });
}
