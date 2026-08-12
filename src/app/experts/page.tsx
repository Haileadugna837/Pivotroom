import Link from "next/link";
import { getApprovedExperts } from "@/features/experts/server/queries";
import { ExpertCard } from "@/features/experts/components/expert-card";

export default async function ExpertsPage() {
  const experts = await getApprovedExperts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">Find an expert</h1>
      {experts.length === 0 ? (
        <p className="text-sm text-black/60 dark:text-white/60">
          No experts are listed yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {experts.map((expert) => (
            <Link key={expert.id} href={`/experts/${expert.id}`}>
              <ExpertCard
                headline={expert.headline}
                bio={expert.bio}
                pricePer15Min={expert.price_per_15_min}
                currency={expert.currency}
                categoryName={expert.categories?.name ?? null}
                fullName={expert.profile?.full_name ?? null}
                photoUrl={expert.photo_url}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
