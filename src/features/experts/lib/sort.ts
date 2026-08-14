export const SORT_VALUES = ["recommended", "price_desc", "price_asc", "rating_desc", "reviews_desc"] as const;
export type SortValue = (typeof SORT_VALUES)[number];

export function parseSortValue(value: string | undefined): SortValue {
  return (SORT_VALUES as readonly string[]).includes(value ?? "") ? (value as SortValue) : "recommended";
}

type SortableExpert = { id: string; price_per_15_min: number | null };
type RatingSummary = { average: number; count: number };

export function sortExpertsBy<T extends SortableExpert>(
  experts: T[],
  sort: SortValue,
  ratings: Map<string, RatingSummary>,
): T[] {
  if (sort === "recommended") return experts;

  const withKeys = experts.map((expert) => ({
    expert,
    price: expert.price_per_15_min,
    rating: ratings.get(expert.id)?.average ?? 0,
    count: ratings.get(expert.id)?.count ?? 0,
  }));

  switch (sort) {
    case "price_asc":
      withKeys.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price_desc":
      withKeys.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case "rating_desc":
      withKeys.sort((a, b) => b.rating - a.rating || b.count - a.count);
      break;
    case "reviews_desc":
      withKeys.sort((a, b) => b.count - a.count || b.rating - a.rating);
      break;
  }

  return withKeys.map((w) => w.expert);
}
