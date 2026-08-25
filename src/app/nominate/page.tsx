import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { NominateForm } from "@/features/nominations/components/nominate-form";

export const metadata: Metadata = {
  title: "Nominate an expert",
  description: "Nominate someone you know to become a Pivotroom.africa expert.",
};

export default async function NominatePage() {
  const user = await getUser();

  return (
    <div className="mx-auto max-w-lg bg-pivot-paper px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold text-pivot-ink">Nominate an expert</h1>
      <p className="mb-6 text-sm text-pivot-muted">
        Know someone who&apos;d be a great 1:1 expert on Pivotroom? Tell us about them — we review
        every nomination.
      </p>

      {user ? (
        <NominateForm />
      ) : (
        <p className="text-sm text-pivot-ink">
          <a href="/login?next=/nominate" className="underline">
            Sign in
          </a>{" "}
          to submit a nomination and track its progress in your dashboard.
        </p>
      )}
    </div>
  );
}
