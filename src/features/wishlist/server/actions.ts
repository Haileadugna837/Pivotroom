"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleWishlist(expertId: string): Promise<{ wishlisted: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("expert_id", expertId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
    if (error) throw error;
    revalidatePath("/dashboard/wishlist");
    return { wishlisted: false };
  }

  const { error } = await supabase.from("wishlists").insert({ user_id: user.id, expert_id: expertId });
  if (error) throw error;
  revalidatePath("/dashboard/wishlist");
  return { wishlisted: true };
}
