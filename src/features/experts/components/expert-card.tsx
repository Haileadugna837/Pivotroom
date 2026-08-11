type ExpertCardProps = {
  headline: string | null;
  bio: string | null;
  sessionRate: number | null;
  currency: string;
  sessionDurationMinutes: number;
  categoryName: string | null;
  fullName: string | null;
};

export function ExpertCard({
  headline,
  bio,
  sessionRate,
  currency,
  sessionDurationMinutes,
  categoryName,
  fullName,
}: ExpertCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 dark:border-white/15">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{fullName ?? "Expert"}</h3>
        {categoryName && (
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
            {categoryName}
          </span>
        )}
      </div>
      {headline && <p className="text-sm text-black/70 dark:text-white/70">{headline}</p>}
      {bio && <p className="line-clamp-2 text-xs text-black/50 dark:text-white/50">{bio}</p>}
      <div className="mt-2 text-sm font-medium">
        {sessionRate != null
          ? `${currency} ${sessionRate} / ${sessionDurationMinutes} min`
          : "Rate not set"}
      </div>
    </div>
  );
}
