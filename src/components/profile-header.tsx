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
    <div className="flex items-center gap-4 rounded-xl border border-black/10 p-4 dark:border-white/15">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/5 text-xl font-semibold text-black/50 dark:bg-white/10 dark:text-white/50">
        {initial}
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold">{name || "—"}</p>
        <p className="truncate text-sm text-black/50 dark:text-white/50">{email}</p>
        <p className="mt-1 text-xs text-black/40 dark:text-white/40">
          {roleLabel ? `${roleLabel} · ` : ""}Joined {joined}
        </p>
      </div>
    </div>
  );
}
