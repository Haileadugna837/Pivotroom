"use client";

type MobileBookingBarProps = {
  price: number | null;
  currency: string;
  targetId: string;
};

export function MobileBookingBar({ price, currency, targetId }: MobileBookingBarProps) {
  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-black/10 bg-background/95 px-4 py-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-col leading-tight">
        <span className="text-base font-semibold">
          {price != null ? `${currency} ${price}` : "Rate not set"}
        </span>
        <span className="text-xs text-black/50 dark:text-white/50">Session</span>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Book a session
      </button>
    </div>
  );
}
