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
      <div className="mb-4 flex flex-wrap gap-2 border-b border-pivot-line pb-3">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/bookings?tab=${t.key}`}
            className={`rounded-md px-3 py-1.5 text-sm ${
              activeTab === t.key
                ? "bg-pivot-ink text-pivot-paper"
                : "text-pivot-muted hover:bg-pivot-paper-2"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-pivot-muted">No bookings in this view.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-pivot-line text-pivot-muted">
                <th className="py-2 pr-4 font-medium">When</th>
                <th className="py-2 pr-4 font-medium">Client</th>
                <th className="py-2 pr-4 font-medium">Expert</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-pivot-line text-pivot-ink">
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
