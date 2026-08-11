import {
  addAvailabilityWindow,
  deleteAvailabilityWindow,
} from "@/features/booking/server/availability-actions";

type AvailabilityWindow = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export function AvailabilityManager({ windows }: { windows: AvailabilityWindow[] }) {
  return (
    <div className="flex flex-col gap-4">
      <form action={addAvailabilityWindow} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          Date
          <input
            type="date"
            name="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          Start time
          <input
            type="time"
            name="start_time"
            required
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <label className="text-sm">
          End time
          <input
            type="time"
            name="end_time"
            required
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Add
        </button>
      </form>

      {windows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          No upcoming availability set — clients can't book you until you add some.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {windows.map((w) => (
            <li
              key={w.id}
              className="flex items-center justify-between rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <span>
                {w.date} · {w.start_time.slice(0, 5)}–{w.end_time.slice(0, 5)}
              </span>
              <form action={deleteAvailabilityWindow}>
                <input type="hidden" name="id" value={w.id} />
                <button type="submit" className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
