import Link from "next/link";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { VerifiedBadge } from "@/features/experts/components/verified-badge";

type FeaturedExpertCardProps = {
  expertId: string;
  href: string;
  fullName: string | null;
  photoUrl: string | null;
  headline: string | null;
  bio: string | null;
  pricePer15Min: number | null;
  currency: string;
  wishlisted: boolean;
  isSignedIn: boolean;
  donatesToNgo?: boolean;
};

export function FeaturedExpertCard({
  expertId,
  href,
  fullName,
  photoUrl,
  headline,
  bio,
  pricePer15Min,
  currency,
  wishlisted,
  isSignedIn,
  donatesToNgo = false,
}: FeaturedExpertCardProps) {
  const name = fullName ?? "Expert";

  return (
    <div className="group relative flex w-36 shrink-0 flex-col gap-1.5 sm:w-44">
      <Link href={href} className="contents">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-pivot-paper-2">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-pivot-muted">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-pivot-ink/0 opacity-0 transition-all duration-150 group-hover:bg-pivot-ink/20 group-hover:opacity-100">
            <span className="rounded-full bg-pivot-white px-3 py-1.5 text-xs font-semibold text-pivot-ink shadow">
              See times
            </span>
          </div>
          <span className="absolute bottom-2 left-2 rounded-full bg-pivot-white px-2 py-0.5 text-[10px] font-medium text-pivot-ink shadow">
            Top Expert
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <h3 className="truncate text-sm font-medium text-pivot-ink">{name}</h3>
          <VerifiedBadge gold={donatesToNgo} size={13} />
        </div>
        <p className="text-xs font-medium text-pivot-ink">
          {pricePer15Min != null ? `${currency} ${pricePer15Min} • Session` : "Rate not set"}
        </p>
        {(headline || bio) && (
          <p className="line-clamp-2 text-xs text-pivot-muted">{headline ?? bio}</p>
        )}
      </Link>
      <WishlistHeartButton
        expertId={expertId}
        initialWishlisted={wishlisted}
        isSignedIn={isSignedIn}
        className="absolute right-1.5 top-1.5 h-7 w-7"
      />
    </div>
  );
}
