"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type NominateState = { error?: string };

export async function submitNomination(
  _prevState: NominateState,
  formData: FormData,
): Promise<NominateState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/nominate");

  const nomineeName = String(formData.get("nominee_name") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const links = [
    String(formData.get("link1") ?? "").trim(),
    String(formData.get("link2") ?? "").trim(),
    String(formData.get("link3") ?? "").trim(),
  ].filter(Boolean);

  if (!nomineeName) return { error: "Enter who you're nominating." };
  if (!reason) return { error: "Tell us why they'd be a great expert." };
  for (const link of links) {
    if (!/^https?:\/\/.+/.test(link)) {
      return { error: "Links must start with http:// or https://" };
    }
  }

  // Auto-merge: nominating the same name again (case/whitespace-insensitive)
  // attaches to the existing nominee instead of creating a duplicate — that's
  // the "automatic" half of merging; admins can still manually merge
  // differently-spelled duplicates later from /admin/nominees.
  const { data: existing, error: findError } = await supabase
    .from("nominees")
    .select("id")
    .ilike("name", nomineeName)
    .limit(1)
    .maybeSingle();
  if (findError) return { error: findError.message };

  let nomineeId = existing?.id;
  if (!nomineeId) {
    const { data: nominee, error: nomineeError } = await supabase
      .from("nominees")
      .insert({ name: nomineeName })
      .select("id")
      .single();
    if (nomineeError) return { error: nomineeError.message };
    nomineeId = nominee.id;
  }

  const { error } = await supabase.from("nominations").insert({
    nominee_id: nomineeId,
    nominator_id: user.id,
    reason,
    links,
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/nominations");
  redirect("/dashboard/nominations?nominated=1");
}
