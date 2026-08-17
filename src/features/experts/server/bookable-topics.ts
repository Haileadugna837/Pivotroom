import "server-only";
import { createClient } from "@/lib/supabase/server";

export type BookableTopic = {
  id: string;
  title: string;
  description: string;
  expertise_topic_id: string;
  industry_id: string | null;
  sort_order: number;
  active: boolean;
};

export async function getMyBookableTopics(expertId: string): Promise<BookableTopic[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_bookable_topics")
    .select("id, title, description, expertise_topic_id, industry_id, sort_order, active")
    .eq("expert_id", expertId)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getPublicBookableTopics(expertId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expert_bookable_topics")
    .select("id, title, description")
    .eq("expert_id", expertId)
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}
