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
      <div className="mb-4 flex flex-wrap gap-2 border-b border-black/10 pb-3 dark:border-white/15">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/payouts?tab=${t.key}`}
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

      {payouts.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No payouts in this view.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {payouts.map((p) => (
            <li key={p.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {p.expertProfile?.full_name ?? p.expertProfile?.email ?? "Unknown expert"}
                  </p>
                  <p className="text-black/60 dark:text-white/60">
                    {p.bookings ? new Date(p.bookings.start_time).toLocaleString() : ""} —{" "}
                    {p.amount != null ? `${p.bookings?.currency} ${p.amount}` : "no amount"}
                  </p>
                </div>
                {p.status === "unpaid" ? (
                  <form action={markPayoutPaid}>
                    <input type="hidden" name="payout_id" value={p.id} />
                    <button className="rounded-md bg-foreground px-3 py-1.5 text-background">
                      Mark paid
                    </button>
                  </form>
                ) : (
                  <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs dark:bg-white/10">
                    Paid {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : ""}
                  </span>
                )}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-black/50 dark:text-white/50">
                  Details
                </summary>
                <div className="mt-2 space-y-1 border-t border-black/10 pt-2 text-black/70 dark:border-white/15 dark:text-white/70">
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
                  <p className="font-medium text-black dark:text-white">Pay to:</p>
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
