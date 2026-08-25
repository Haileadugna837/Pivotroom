import { getAuditLogForAdmin } from "@/features/admin/server/queries";

const ACTION_LABEL: Record<string, string> = {
  expert_status_approved: "Approved expert",
  expert_status_rejected: "Rejected expert",
  expert_status_suspended: "Suspended expert",
  expert_status_approved_bulk: "Bulk-approved experts",
  payment_verified: "Verified payment",
  payment_rejected: "Rejected payment",
  payout_marked_paid: "Marked payout paid",
  account_status_active: "Set account active",
  account_status_restricted: "Restricted account",
  account_status_suspended: "Suspended account",
};

export default async function AdminAuditLogPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return (
      <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
        <h1 className="text-xl font-semibold text-pivot-ink">Audit Log</h1>
        <p className="mt-4 text-sm text-pivot-accent">
          `SUPABASE_SERVICE_ROLE_KEY` is not set — admin queries cannot run yet.
        </p>
      </div>
    );
  }

  const entries = await getAuditLogForAdmin();

  return (
    <div className="mx-auto max-w-3xl bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Audit Log</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        A record of sensitive admin actions: expert approvals, payment verification, payouts, and
        account status changes. Showing the most recent {entries.length} entries.
      </p>

      {entries.length === 0 ? (
        <p className="text-sm text-pivot-muted">No actions logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e.id} className="rounded-lg border border-pivot-line bg-pivot-white p-4 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-pivot-ink">{ACTION_LABEL[e.action] ?? e.action}</p>
                <p className="text-pivot-muted">{new Date(e.created_at).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-pivot-ink-2">
                By {e.adminProfile?.full_name ?? e.adminProfile?.email ?? "Unknown admin"}
                {e.target_id && (
                  <>
                    {" "}
                    on {e.target_table} <span className="font-mono">{e.target_id}</span>
                  </>
                )}
              </p>
              {e.details != null && (
                <pre className="mt-2 overflow-x-auto rounded-md bg-pivot-paper-2 p-2 text-xs text-pivot-ink">
                  {JSON.stringify(e.details, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
