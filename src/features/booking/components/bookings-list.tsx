import Link from "next/link";

type BookingRow = {
  id: string;
  start_time: string;
  status: string;
  price: number | null;
  currency: string;
};

export function BookingsList({ bookings, emptyLabel }: { bookings: BookingRow[]; emptyLabel: string }) {
  if (!bookings.length) {
    return <p className="text-sm text-black/50 dark:text-white/50">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {bookings.map((b) => (
        <li key={b.id}>
          <Link
            href={`/bookings/${b.id}`}
            className="flex items-center justify-between rounded-lg border border-black/10 p-3 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            <span>{new Date(b.start_time).toLocaleString()}</span>
            <span className="text-black/60 dark:text-white/60">{b.status}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
