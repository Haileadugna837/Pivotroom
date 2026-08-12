"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_TOTAL_PERCENTAGE = 100;

export type NgoAllocationState = { error?: string };

export async function addNgoAllocation(
  _prevState: NgoAllocationState,
  formData: FormData,
): Promise<NgoAllocationState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const ngoId = String(formData.get("ngo_id") ?? "");
  const percentage = Number(formData.get("percentage"));

  if (!ngoId) return { error: "Pick an NGO." };
  if (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100) {
    return { error: "Enter a percentage between 1 and 100." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("expert_ngo_allocations")
    .select("ngo_id, percentage")
    .eq("expert_id", user.id);
  if (existingError) return { error: existingError.message };

  if (existing.some((row) => row.ngo_id === ngoId)) {
    return { error: "You already allocated a percentage to this NGO." };
  }

  const currentTotal = existing.reduce((sum, row) => sum + row.percentage, 0);
  if (currentTotal + percentage > MAX_TOTAL_PERCENTAGE) {
    return {
      error: `That would total ${currentTotal + percentage}% — you can allocate up to ${MAX_TOTAL_PERCENTAGE}% across all NGOs.`,
    };
  }

  const { error } = await supabase
    .from("expert_ngo_allocations")
    .insert({ expert_id: user.id, ngo_id: ngoId, percentage });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/expert/profile");
  return {};
}

export async function deleteNgoAllocation(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("expert_ngo_allocations").delete().eq("id", id).eq("expert_id", user.id);

  revalidatePath("/dashboard/expert/profile");
}
