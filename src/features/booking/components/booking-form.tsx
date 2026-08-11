"use client";

import { useMemo, useState } from "react";
import { createBooking } from "@/features/booking/server/actions";

type AvailabilityWindow = {
  id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
};

const DURATIONS = [15, 30, 45, 60] as const;

function toMinutes(hhmmss: string) {
  const [h, m] = hhmmss.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function formatWindowLabel(w: AvailabilityWindow) {
  const date = new Date(`${w.date}T00:00:00`);
  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${dateLabel}, ${w.start_time.slice(0, 5)}–${w.end_time.slice(0, 5)}`;
}

type BookingFormProps = {
  expertId: string;
  pricePer15Min: number | null;
  currency: string;
  availability: AvailabilityWindow[];
};

export function BookingForm({ expertId, pricePer15Min, currency, availability }: BookingFormProps) {
  const [windowId, setWindowId] = useState(availability[0]?.id ?? "");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(15);
  const [startTime, setStartTime] = useState("");

  const selectedWindow = availability.find((w) => w.id === windowId) ?? null;

  const startOptions = useMemo(() => {
    if (!selectedWindow) return [];
    const windowStart = toMinutes(selectedWindow.start_time);
    const windowEnd = toMinutes(selectedWindow.end_time);
    const options: string[] = [];
    for (let t = windowStart; t + duration <= windowEnd; t += 15) {
      options.push(fromMinutes(t));
    }
    return options;
  }, [selectedWindow, duration]);

  const price = pricePer15Min != null ? (pricePer15Min * duration) / 15 : null;
  const chosenStart = startOptions.includes(startTime) ? startTime : (startOptions[0] ?? "");

  if (availability.length === 0) {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        This expert has no available times right now.
      </p>
    );
  }

  return (
    <form action={createBooking} className="flex flex-col gap-3">
      <input type="hidden" name="expert_id" value={expertId} />
      <input type="hidden" name="date" value={selectedWindow?.date ?? ""} />
      <input type="hidden" name="start_time" value={chosenStart} />
      <input type="hidden" name="duration_minutes" value={duration} />

      <label className="text-sm">
        Available window
        <select
          value={windowId}
          onChange={(e) => setWindowId(e.target.value)}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        >
          {availability.map((w) => (
            <option key={w.id} value={w.id}>
              {formatWindowLabel(w)}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        Session length
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value) as (typeof DURATIONS)[number])}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        >
          {DURATIONS.map((d) => (
            <option key={d} value={d}>
              {d} minutes
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        Start time
        <select
          value={chosenStart}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={startOptions.length === 0}
          className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
        >
          {startOptions.length === 0 ? (
            <option value="">No times fit this duration in this window</option>
          ) : (
            startOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))
          )}
        </select>
      </label>

      <p className="text-sm font-medium">
        {price != null ? `Total: ${currency} ${price}` : "Price not set by expert"}
      </p>

      <button
        type="submit"
        disabled={startOptions.length === 0}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        Request booking
      </button>
    </form>
  );
}
