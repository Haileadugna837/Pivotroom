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
  categoryName: string | null;
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
  categoryName,
  fullName,
  photoUrl,
  wishlisted,
  isSignedIn,
  donatesToNgo = false,
}: ExpertCardProps) {
  return (
    <div className="relative flex flex-col gap-2">
      <Link href={href} className="contents">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={fullName ?? "Expert"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-black/20 dark:text-white/20">
              {(fullName ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <h3 className="font-medium">{fullName ?? "Expert"}</h3>
          <VerifiedBadge gold={donatesToNgo} />
        </div>
        <p className="text-sm font-medium">
          {pricePer15Min != null ? `${currency} ${pricePer15Min} • 15 min` : "Rate not set"}
        </p>
        {(headline || bio) && (
          <p className="line-clamp-2 text-sm text-black/60 dark:text-white/60">{headline ?? bio}</p>
        )}
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
