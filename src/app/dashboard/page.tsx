import { getMyBookingsAsClient } from "@/features/booking/server/queries";
import { BookingsList } from "@/features/booking/components/bookings-list";

export default async function DashboardPage() {
  const clientBookings = await getMyBookingsAsClient();
  const bookings = clientBookings.map((b) => ({
    ...b,
    counterpartHref: `/experts/${b.expert_id}`,
  }));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold">My Bookings</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">
        Sessions you&apos;ve booked with experts.
      </p>
      <div className="mt-6">
        <BookingsList bookings={bookings} emptyLabel="You haven't booked a session yet." />
      </div>
    </div>
  );
}
