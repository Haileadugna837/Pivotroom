import Link from "next/link";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";
import { VerifiedBadge } from "@/features/experts/components/verified-badge";

type ExpertCardProps = {
  expertId: string;
  href: string;
  headline: string | null;
  bio: string | null;
  pricePer15Min: number | null;
  currency: string;
  fullName: string | null;
  photoUrl: string | null;
  wishlisted: boolean;
  isSignedIn: boolean;
  donatesToNgo?: boolean;
};

export function ExpertCard({
  expertId,
  href,
  headline,
  bio,
  pricePer15Min,
  currency,
  fullName,
  photoUrl,
  wishlisted,
  isSignedIn,
  donatesToNgo = false,
}: ExpertCardProps) {
  return (
    <div className="group relative flex flex-col gap-2">
      <Link href={href} className="contents">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-pivot-paper-2">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={fullName ?? "Expert"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-pivot-muted">
              {(fullName ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-pivot-ink/0 opacity-0 transition-all duration-150 group-hover:bg-pivot-ink/20 group-hover:opacity-100">
            <span className="rounded-full bg-pivot-white px-4 py-2 text-sm font-semibold text-pivot-ink shadow">
              See times
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-pivot-ink">{fullName ?? "Expert"}</h3>
          <VerifiedBadge gold={donatesToNgo} />
        </div>
        <p className="text-sm font-medium text-pivot-ink">
          {pricePer15Min != null ? `${currency} ${pricePer15Min} • 15 min` : "Rate not set"}
        </p>
        {(headline || bio) && <p className="line-clamp-2 text-sm text-pivot-muted">{headline ?? bio}</p>}
      </Link>
      <WishlistHeartButton
        expertId={expertId}
        initialWishlisted={wishlisted}
        isSignedIn={isSignedIn}
        className="absolute right-2 top-2"
      />
    </div>
  );
}
