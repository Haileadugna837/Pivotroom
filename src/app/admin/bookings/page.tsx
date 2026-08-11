import { getAllBookingsForAdmin, type BookingTab } from "@/features/admin/server/queries";
import { BookingsTable } from "@/features/admin/components/bookings-table";

const VALID_TABS: BookingTab[] = ["all", "pending", "confirmed", "completed", "cancelled", "expired"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-xl font-semibold">Bookings</h1>
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-500">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const { tab } = await searchParams;
  const activeTab: BookingTab = VALID_TABS.includes(tab as BookingTab) ? (tab as BookingTab) : "all";

  const bookings = await getAllBookingsForAdmin(activeTab);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Bookings</h1>
      <BookingsTable bookings={bookings} activeTab={activeTab} />
    </div>
  );
}
