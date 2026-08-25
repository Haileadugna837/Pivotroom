import Link from "next/link";
import { FeaturedExpertCard } from "@/features/experts/components/featured-expert-card";

type Expert = {
  id: string;
  headline: string | null;
  bio: string | null;
  price_per_15_min: number | null;
  currency: string;
  photo_url: string | null;
  profile: { full_name: string | null } | null;
};

type CategoryExpertRowProps = {
  categoryId: string;
  categoryName: string;
  tagline?: string | null;
  experts: Expert[];
  wishlistedIds: Set<string>;
  donatingIds: Set<string>;
  isSignedIn: boolean;
  seeAllHref?: string;
};

export function CategoryExpertRow({
  categoryId,
  categoryName,
  tagline,
  experts,
  wishlistedIds,
  donatingIds,
  isSignedIn,
  seeAllHref,
}: CategoryExpertRowProps) {
  return (
    <div id={`category-${categoryId}`} className="scroll-mt-20">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold text-pivot-ink">
          {categoryName}.{" "}
          <span className="font-normal text-pivot-muted">
            {tagline ?? `Connect with vetted ${categoryName.toLowerCase()} experts over video.`}
          </span>
        </h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="shrink-0 text-sm font-medium text-pivot-ink hover:underline">
            See all →
          </Link>
        )}
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {experts.map((expert) => (
          <FeaturedExpertCard
            key={expert.id}
            expertId={expert.id}
            href={`/experts/${expert.id}`}
            fullName={expert.profile?.full_name ?? null}
            photoUrl={expert.photo_url}
            headline={expert.headline}
            bio={expert.bio}
            pricePer15Min={expert.price_per_15_min}
            currency={expert.currency}
            wishlisted={wishlistedIds.has(expert.id)}
            isSignedIn={isSignedIn}
            donatesToNgo={donatingIds.has(expert.id)}
          />
        ))}
      </div>
    </div>
  );
}
