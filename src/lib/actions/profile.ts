"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/require-user";

export type UpdateProfileResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateProfileName(
  fullName: string
): Promise<UpdateProfileResult> {
  const trimmed = fullName.trim();

  if (trimmed.length < 2) {
    return { ok: false, error: "Please enter at least 2 characters." };
  }

  if (trimmed.length > 80) {
    return { ok: false, error: "Name must be 80 characters or fewer." };
  }

  const user = await requireUser("/account");
  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: trimmed,
        email: user.email,
      },
      { onConflict: "id" }
    );

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { full_name: trimmed },
  });

  if (metaError) {
    return { ok: false, error: metaError.message };
  }

  revalidatePath("/account");
  revalidatePath("/", "layout");
  return { ok: true };
}
