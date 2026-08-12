import Link from "next/link";
import { WishlistHeartButton } from "@/features/wishlist/components/wishlist-heart-button";

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
          {categoryName && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-black">
              {categoryName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <h3 className="font-medium">{fullName ?? "Expert"}</h3>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-label="Approved expert">
            <circle cx="10" cy="10" r="10" fill="currentColor" className="text-blue-500" />
            <path
              d="M6 10.5l2.5 2.5L14 7.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
