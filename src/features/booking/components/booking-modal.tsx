"use client";

import { useEffect } from "react";
import { BookingPicker, type BookingPickerProps } from "@/features/booking/components/booking-picker";

type BookingModalProps = BookingPickerProps & {
  onClose: () => void;
};

export function BookingModal({ onClose, ...pickerProps }: BookingModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request a time"
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-pivot-white text-pivot-ink sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-pivot-line px-5 py-4">
          <h2 className="text-lg font-semibold">Request a time</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-pivot-muted hover:text-pivot-ink"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <BookingPicker {...pickerProps} />
        </div>
      </div>
    </div>
  );
}
