type ProfileHeaderProps = {
  name: string;
  email: string;
  joinedAt: string;
  roleLabel?: string;
};

export function ProfileHeader({ name, email, joinedAt, roleLabel }: ProfileHeaderProps) {
  const joined = new Date(joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const initial = (name || email).charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-pivot-line p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pivot-paper-2 text-xl font-semibold text-pivot-muted">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-pivot-ink">{name || "—"}</p>
        <p className="truncate text-sm text-pivot-muted">{email}</p>
        <p className="mt-1 text-xs text-pivot-muted">
          {roleLabel ? `${roleLabel} · ` : ""}Joined {joined}
        </p>
      </div>
    </div>
  );
}
