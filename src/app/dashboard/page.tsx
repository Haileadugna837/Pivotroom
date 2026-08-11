import { createClient } from "@/lib/supabase/server";
import { getMyBookingsAsClient } from "@/features/booking/server/queries";
import { BookingsList } from "@/features/booking/components/bookings-list";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clientBookings = await getMyBookingsAsClient();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold">My Bookings</h1>
      <p className="mt-1 text-sm text-black/50 dark:text-white/50">{user?.email}</p>
      <div className="mt-6">
        <BookingsList bookings={clientBookings} emptyLabel="You haven't booked a session yet." />
      </div>
    </div>
  );
}
