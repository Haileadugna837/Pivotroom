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
  pending_payment: "bg-pivot-accent/10 text-pivot-accent",
  payment_submitted: "bg-pivot-paper-2 text-pivot-ink-2",
  confirmed: "bg-pivot-olive/10 text-pivot-olive",
  completed: "bg-pivot-paper-2 text-pivot-muted",
  rejected: "bg-pivot-danger/10 text-pivot-danger",
  cancelled: "bg-pivot-paper-2 text-pivot-muted",
};

export function BookingsList({ bookings, emptyLabel }: { bookings: BookingRow[]; emptyLabel: string }) {
  if (!bookings.length) {
    return <p className="text-sm text-pivot-muted">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookings.map((b) => {
        const date = new Date(b.start_time);
        return (
          <li key={b.id} className="rounded-lg border border-pivot-line">
            <div className="flex items-center justify-between gap-3 px-4 pt-3">
              {b.counterpartHref ? (
                <Link href={b.counterpartHref} className="text-sm font-medium text-pivot-ink hover:underline">
                  {b.counterpartName ?? "Expert"}
                </Link>
              ) : (
                <span className="text-sm font-medium text-pivot-ink">{b.counterpartName ?? "—"}</span>
              )}
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  STATUS_STYLE[b.status] ?? "bg-pivot-paper-2 text-pivot-muted"
                }`}
              >
                {STATUS_LABEL[b.status] ?? b.status}
              </span>
            </div>
            <Link
              href={`/bookings/${b.id}`}
              className="flex items-center justify-between gap-3 px-4 pb-3 pt-1 text-sm text-pivot-ink-2 hover:text-pivot-ink"
            >
              <span>
                {date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                {" · "}
                {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
              </span>
              {b.price != null && <span className="text-pivot-muted">{b.currency} {b.price}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
