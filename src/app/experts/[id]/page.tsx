import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getApprovedExpertById } from "@/features/experts/server/queries";
import { BookingForm } from "@/features/booking/components/booking-form";

export default async function ExpertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await getApprovedExpertById(id);
  if (!expert) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-xl font-semibold">{expert.profile?.full_name ?? "Expert"}</h1>
      {expert.categories?.name && (
        <span className="mt-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs dark:bg-white/10">
          {expert.categories.name}
        </span>
      )}
      {expert.headline && <p className="mt-3 text-sm">{expert.headline}</p>}
      {expert.bio && (
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">{expert.bio}</p>
      )}
      <p className="mt-3 font-medium">
        {expert.session_rate != null
          ? `${expert.currency} ${expert.session_rate} / ${expert.session_duration_minutes} min`
          : "Rate not set"}
      </p>

      <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium">Book a session</h2>
        {user ? (
          <BookingForm
            expertId={expert.id}
            sessionRate={expert.session_rate}
            currency={expert.currency}
            sessionDurationMinutes={expert.session_duration_minutes}
          />
        ) : (
          <p className="text-sm">
            <a href={`/login?next=/experts/${expert.id}`} className="underline">
              Sign in
            </a>{" "}
            to book a session.
          </p>
        )}
      </div>
    </div>
  );
}
