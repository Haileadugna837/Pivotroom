import Link from "next/link";
import { markPayoutPaid } from "@/features/admin/server/actions";
import type { PayoutTab } from "@/features/admin/server/queries";

type Profile = { full_name: string | null; email: string } | null;

type Payout = {
  id: string;
  amount: number | null;
  status: string;
  paid_at: string | null;
  bookings: {
    client_id: string;
    expert_id: string;
    start_time: string;
    end_time: string;
    currency: string;
  } | null;
  clientProfile: Profile;
  expertProfile: Profile;
  expertPayoutInfo: { payout_account_name: string | null; payout_account_number: string | null } | null;
};

const TABS: { key: PayoutTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unpaid", label: "Unpaid" },
  { key: "paid", label: "Paid" },
];

export function PayoutsList({ payouts, activeTab }: { payouts: Payout[]; activeTab: PayoutTab }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-pivot-line pb-3">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/payouts?tab=${t.key}`}
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

      {payouts.length === 0 ? (
        <p className="text-sm text-pivot-muted">No payouts in this view.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {payouts.map((p) => (
            <li key={p.id} className="rounded-lg border border-pivot-line bg-pivot-white p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-pivot-ink">
                    {p.expertProfile?.full_name ?? p.expertProfile?.email ?? "Unknown expert"}
                  </p>
                  <p className="text-pivot-ink-2">
                    {p.bookings ? new Date(p.bookings.start_time).toLocaleString() : ""} —{" "}
                    {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "no amount"}
                  </p>
                </div>
                {p.status === "unpaid" ? (
                  <form action={markPayoutPaid}>
                    <input type="hidden" name="payout_id" value={p.id} />
                    <button className="rounded-md bg-pivot-ink px-3 py-1.5 text-pivot-paper">
                      Mark paid
                    </button>
                  </form>
                ) : (
                  <span className="rounded-full bg-pivot-olive/10 px-3 py-1.5 text-xs text-pivot-olive">
                    Paid {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : ""}
                  </span>
                )}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-pivot-muted">
                  Details
                </summary>
                <div className="mt-2 space-y-1 border-t border-pivot-line pt-2 text-pivot-ink-2">
                  <p>Expert email: {p.expertProfile?.email ?? "—"}</p>
                  <p>
                    Client: {p.clientProfile?.full_name ?? "—"} ({p.clientProfile?.email ?? "—"})
                  </p>
                  {p.bookings && (
                    <p>
                      Session: {new Date(p.bookings.start_time).toLocaleString()} –{" "}
                      {new Date(p.bookings.end_time).toLocaleTimeString()}
                    </p>
                  )}
                  <p>Payout amount: {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "—"}</p>
                  <p className="font-medium text-pivot-ink">Pay to:</p>
                  <p>Account name: {p.expertPayoutInfo?.payout_account_name ?? "Not provided"}</p>
                  <p>Account number: {p.expertPayoutInfo?.payout_account_number ?? "Not provided"}</p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
