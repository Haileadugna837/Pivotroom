import Link from "next/link";
import type { BookingTab } from "@/features/admin/server/queries";

type Profile = { full_name: string | null; email: string } | null;

type BookingRow = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  price: number | null;
  currency: string;
  clientProfile: Profile;
  expertProfile: Profile;
};

const TABS: { key: BookingTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "expired", label: "Expired" },
];

export function BookingsTable({
  bookings,
  activeTab,
}: {
  bookings: BookingRow[];
  activeTab: BookingTab;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-black/10 pb-3 dark:border-white/15">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/bookings?tab=${t.key}`}
            className={`rounded-md px-3 py-1.5 text-sm ${
              activeTab === t.key
                ? "bg-foreground text-background"
                : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No bookings in this view.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-black/50 dark:border-white/15 dark:text-white/50">
                <th className="py-2 pr-4 font-medium">When</th>
                <th className="py-2 pr-4 font-medium">Client</th>
                <th className="py-2 pr-4 font-medium">Expert</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-black/5 dark:border-white/10">
                  <td className="py-2 pr-4">
                    <Link href={`/bookings/${b.id}`} className="hover:underline">
                      {new Date(b.start_time).toLocaleString()}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{b.clientProfile?.full_name ?? b.clientProfile?.email ?? "—"}</td>
                  <td className="py-2 pr-4">{b.expertProfile?.full_name ?? b.expertProfile?.email ?? "—"}</td>
                  <td className="py-2 pr-4">
                    {b.price != null ? `${b.currency} ${b.price}` : "—"}
                  </td>
                  <td className="py-2 pr-4">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
