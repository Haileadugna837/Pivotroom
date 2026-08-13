export type SearchableExpert = {
  id: string;
  headline: string | null;
  bio: string | null;
  price_per_15_min: number | null;
  currency: string;
  photo_url: string | null;
  categories: { name: string } | null;
  profile: { full_name: string | null } | null;
};

export function matchesExpertQuery(expert: SearchableExpert, words: string[]) {
  const haystack = [expert.profile?.full_name, expert.headline, expert.bio, expert.categories?.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return words.every((word) => haystack.includes(word));
}
