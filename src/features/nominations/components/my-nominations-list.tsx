const STATUS_LABEL: Record<string, string> = {
  pending: "Submitted",
  in_review: "In review",
  added: "Added as expert",
  declined: "Not selected",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "text-black/50 dark:text-white/50",
  in_review: "text-blue-700 dark:text-blue-400",
  added: "text-emerald-700 dark:text-emerald-400",
  declined: "text-black/40 dark:text-white/40",
};

type Nomination = {
  id: string;
  reason: string;
  links: string[];
  created_at: string;
  nominees: { id: string; name: string; status: string } | null;
};

export function MyNominationsList({ nominations }: { nominations: Nomination[] }) {
  if (nominations.length === 0) {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        You haven&apos;t nominated anyone yet.{" "}
        <a href="/nominate" className="underline">
          Nominate an expert
        </a>
        .
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {nominations.map((n) => {
        const status = n.nominees?.status ?? "pending";
        return (
          <li key={n.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium">{n.nominees?.name ?? "Unknown"}</p>
              <span className={`text-xs font-medium ${STATUS_STYLE[status] ?? ""}`}>
                {STATUS_LABEL[status] ?? status}
              </span>
            </div>
            <p className="mt-1 text-black/70 dark:text-white/70">{n.reason}</p>
            {n.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {n.links.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-black/40 dark:text-white/40">
              Submitted {new Date(n.created_at).toLocaleDateString()}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
