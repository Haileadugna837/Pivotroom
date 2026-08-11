import { createBooking } from "@/features/booking/server/actions";

type BookingFormProps = {
  expertId: string;
  sessionRate: number | null;
  currency: string;
  sessionDurationMinutes: number;
};

export function BookingForm({
  expertId,
  sessionRate,
  currency,
  sessionDurationMinutes,
}: BookingFormProps) {
  return (
    <form action={createBooking} className="flex flex-col gap-3">
      <input type="hidden" name="expert_id" value={expertId} />
      <input type="hidden" name="duration_minutes" value={sessionDurationMinutes} />
      <input type="hidden" name="price" value={sessionRate ?? ""} />
      <input type="hidden" name="currency" value={currency} />
      <label className="text-sm">
        Proposed date &amp; time
        <input
          type="datetime-local"
          name="start_time"
          required
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        />
      </label>
      <p className="text-xs text-black/50 dark:text-white/50">
        The expert will confirm your slot after payment is verified.
      </p>
      <button
        type="submit"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Request booking
      </button>
    </form>
  );
}
