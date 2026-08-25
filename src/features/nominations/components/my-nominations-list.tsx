const STATUS_LABEL: Record<string, string> = {
  pending: "Submitted",
  in_review: "In review",
  added: "Added as expert",
  declined: "Not selected",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "text-pivot-muted",
  in_review: "text-pivot-accent",
  added: "text-pivot-olive",
  declined: "text-pivot-muted",
};

type Nomination = {
  id: string;
  reason: string;
  links: string[];
  created_at: string;
  nominees: { id: string; name: string | null; status: string } | null;
};

export function MyNominationsList({ nominations }: { nominations: Nomination[] }) {
  if (nominations.length === 0) {
    return (
      <p className="text-sm text-pivot-ink-2">
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
          <li key={n.id} className="rounded-lg border border-pivot-line p-4 text-sm text-pivot-ink">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium">{n.nominees?.name ?? "Unknown"}</p>
              <span className={`text-xs font-medium ${STATUS_STYLE[status] ?? ""}`}>
                {STATUS_LABEL[status] ?? status}
              </span>
            </div>
            <p className="mt-1 text-pivot-ink-2">{n.reason}</p>
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
            <p className="mt-2 text-xs text-pivot-muted">
              Submitted {new Date(n.created_at).toLocaleDateString()}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
