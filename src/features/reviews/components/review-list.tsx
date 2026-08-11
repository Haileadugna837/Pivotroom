type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export function ReviewList({
  reviews,
  average,
  count,
}: {
  reviews: Review[];
  average: number | null;
  count: number;
}) {
  return (
    <div>
      <p className="text-sm font-medium">
        {average != null ? `${average.toFixed(1)} ★` : "No reviews yet"}
        {count > 0 && <span className="text-black/50 dark:text-white/50"> ({count})</span>}
      </p>
      {reviews.length > 0 && (
        <ul className="mt-3 flex flex-col gap-3">
          {reviews.map((r) => (
            <li key={r.id} className="text-sm">
              <span className="font-medium">{r.rating} ★</span>
              {r.comment && <p className="text-black/70 dark:text-white/70">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
