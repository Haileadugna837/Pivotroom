"use client";

import { useEffect, useMemo, useState } from "react";
import { createBooking } from "@/features/booking/server/actions";

type AvailabilityWindow = {
  id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
};

const DURATIONS: { minutes: 15 | 30 | 45 | 60; label: string }[] = [
  { minutes: 15, label: "Quick – 15 Min" },
  { minutes: 30, label: "Regular – 30 Min" },
  { minutes: 45, label: "Extra – 45 Min" },
  { minutes: 60, label: "All Access – 60 Min" },
];

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

function clockParts(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const period = h24 >= 12 ? "p" : "a";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { h12, m, period };
}

function formatSlotLabel(startMinutes: number, durationMinutes: number) {
  const start = clockParts(startMinutes);
  const end = clockParts(startMinutes + durationMinutes);
  const startStr = start.m === 0 ? `${start.h12}` : `${start.h12}:${start.m.toString().padStart(2, "0")}`;
  const endStr = end.m === 0 ? `${end.h12}` : `${end.h12}:${end.m.toString().padStart(2, "0")}`;
  if (start.period === end.period) {
    return `${startStr}-${endStr}${end.period}`;
  }
  return `${startStr}${start.period}-${endStr}${end.period}`;
}

function formatDateHeader(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "long", month: "numeric", day: "numeric" });
}

function computeSlotsByDate(availability: AvailabilityWindow[], durationMinutes: number) {
  const map = new Map<string, number[]>();
  for (const w of availability) {
    const windowStart = toMinutes(w.start_time);
    const windowEnd = toMinutes(w.end_time);
    const times: number[] = [];
    for (let t = windowStart; t + durationMinutes <= windowEnd; t += 15) {
      times.push(t);
    }
    if (times.length === 0) continue;
    map.set(w.date, [...(map.get(w.date) ?? []), ...times]);
  }
  return map;
}

const buttonBase = "rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors";
const buttonInactive = "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900";
const buttonActive = "bg-indigo-600 text-white";

type BookingModalProps = {
  expertId: string;
  pricePer15Min: number | null;
  currency: string;
  availability: AvailabilityWindow[];
  average: number | null;
  count: number;
  onClose: () => void;
};

export function BookingModal({
  expertId,
  pricePer15Min,
  currency,
  availability,
  average,
  count,
  onClose,
}: BookingModalProps) {
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(15);
  const [selection, setSelection] = useState<{ date: string; startMinutes: number } | null>(null);

  const slotsByDate = useMemo(() => computeSlotsByDate(availability, duration), [availability, duration]);

  useEffect(() => {
    setSelection(null);
  }, [duration]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const price = pricePer15Min != null ? (pricePer15Min * duration) / 15 : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request a time"
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-background sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/15">
          <h2 className="text-lg font-semibold">Request a time</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-2 text-sm font-medium">1) Select the call duration</p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.minutes}
                type="button"
                onClick={() => setDuration(d.minutes)}
                className={`${buttonBase} ${duration === d.minutes ? buttonActive : buttonInactive}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <p className="mb-2 text-sm font-medium">2) Select a time for your video session</p>
          {slotsByDate.size === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              No times fit this duration — try a shorter session.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {Array.from(slotsByDate.entries()).map(([date, times]) => (
                <div key={date}>
                  <p className="mb-2 text-sm text-black/60 dark:text-white/60">{formatDateHeader(date)}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((t) => {
                      const active = selection?.date === date && selection.startMinutes === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelection({ date, startMinutes: t })}
                          className={`${buttonBase} ${active ? buttonActive : buttonInactive}`}
                        >
                          {formatSlotLabel(t, duration)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          action={createBooking}
          className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4 dark:border-white/15"
        >
          <input type="hidden" name="expert_id" value={expertId} />
          <input type="hidden" name="date" value={selection?.date ?? ""} />
          <input type="hidden" name="start_time" value={selection ? fromMinutes(selection.startMinutes) : ""} />
          <input type="hidden" name="duration_minutes" value={duration} />

          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">
              {price != null ? `${currency} ${price} • Session` : "Rate not set"}
            </span>
            {count > 0 && (
              <span className="text-xs text-black/50 dark:text-white/50">
                ★ {average?.toFixed(1)} ({count})
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!selection}
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-50"
          >
            Request
          </button>
        </form>
      </div>
    </div>
  );
}
