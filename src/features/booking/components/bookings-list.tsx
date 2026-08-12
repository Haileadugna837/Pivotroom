import Link from "next/link";

type BookingRow = {
  id: string;
  start_time: string;
  status: string;
  price: number | null;
  currency: string;
  counterpartName?: string | null;
  counterpartHref?: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "Awaiting payment",
  payment_submitted: "Payment submitted",
  confirmed: "Confirmed",
  completed: "Completed",
  rejected: "Payment rejected",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<string, string> = {
  pending_payment: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  payment_submitted: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  confirmed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  completed: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  cancelled: "bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40",
};

export function BookingsList({ bookings, emptyLabel }: { bookings: BookingRow[]; emptyLabel: string }) {
  if (!bookings.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookings.map((b) => {
        const date = new Date(b.start_time);
        return (
          <li key={b.id} className="rounded-lg border border-black/10 dark:border-white/15">
            <div className="flex items-center justify-between gap-3 px-4 pt-3">
              {b.counterpartHref ? (
                <Link href={b.counterpartHref} className="text-sm font-medium hover:underline">
                  {b.counterpartName ?? "Expert"}
                </Link>
              ) : (
                <span className="text-sm font-medium">{b.counterpartName ?? "—"}</span>
              )}
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLE[b.status] ?? "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                }`}
              >
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <Link
              href={`/bookings/${b.id}`}
              className="flex items-center justify-between gap-3 px-4 pb-3 pt-1 text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              <span>
                {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                {" · "}
                {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
              </span>
              {b.price != null && (
                <span className="text-black/40 dark:text-white/40">
                  {b.currency} {b.price}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
