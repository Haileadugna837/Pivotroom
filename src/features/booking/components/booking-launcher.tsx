"use client";

import { useState } from "react";
import { BookingModal } from "@/features/booking/components/booking-modal";

type AvailabilityWindow = {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
};

type BookingLauncherProps = {
  expertId: string;
  pricePer15Min: number | null;
  currency: string;
  availability: AvailabilityWindow[];
  average: number | null;
  count: number;
  isSignedIn: boolean;
  loginHref: string;
  error?: string;
};

export function BookingLauncher({
  expertId,
  pricePer15Min,
  currency,
  availability,
  average,
  count,
  isSignedIn,
  loginHref,
  error,
}: BookingLauncherProps) {
  const [open, setOpen] = useState(false);
  const hasAvailability = availability.length > 0;
  const canBook = isSignedIn && hasAvailability;

  return (
    <>
      <div id="book-a-session" className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium">Book a session</h2>
        {error && (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {error}
          </p>
        )}
        {!isSignedIn ? (
          <p className="text-sm">
            <a href={loginHref} className="underline">
              Sign in
            </a>{" "}
            to book a session.
          </p>
        ) : !hasAvailability ? (
          <p className="text-sm text-black/60 dark:text-white/60">
            This expert has no available times right now.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Choose a time
          </button>
        )}
      </div>

      {canBook && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-black/10 bg-background/95 px-4 py-3 backdrop-blur md:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">
              {pricePer15Min != null ? `${currency} ${pricePer15Min}` : "Rate not set"}
            </span>
            <span className="text-xs text-black/50 dark:text-white/50">Session</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Book a session
          </button>
        </div>
      )}

      {open && canBook && (
        <BookingModal
          expertId={expertId}
          pricePer15Min={pricePer15Min}
          currency={currency}
          availability={availability}
          average={average}
          count={count}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
