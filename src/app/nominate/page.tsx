import { createClient } from "@/lib/supabase/server";
import { NominateForm } from "@/features/nominations/components/nominate-form";

export default async function NominatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Nominate an expert</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        Know someone who&apos;d be a great 1:1 expert on Pivotroom? Tell us about them — we review
        every nomination.
      </p>

      {user ? (
        <NominateForm />
      ) : (
        <p className="text-sm">
          <a href="/login?next=/nominate" className="underline">
            Sign in
          </a>{" "}
          to submit a nomination and track its progress in your dashboard.
        </p>
      )}
    </div>
  );
}
