import { submitReview } from "@/features/reviews/server/actions";

export function ReviewForm({ bookingId, expertId }: { bookingId: string; expertId: string }) {
  return (
    <form action={submitReview} className="flex flex-col gap-3">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="expert_id" value={expertId} />
      <label className="text-sm">
        Rating
        <select
          name="rating"
          required
          defaultValue="5"
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <textarea
        name="comment"
        rows={3}
        placeholder="How was your session? (optional)"
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <button
        type="submit"
        className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Submit review
      </button>
    </form>
  );
}
