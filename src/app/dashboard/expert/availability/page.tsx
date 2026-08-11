import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyExpertProfile, hasConnectedGoogleCalendar } from "@/features/experts/server/self";
import { getMyAvailability } from "@/features/booking/server/queries";
import { AvailabilityManager } from "@/features/booking/components/availability-manager";

export default async function ExpertAvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);
  if (expertProfile?.status !== "approved") redirect("/dashboard");

  const [calendarConnected, availability] = await Promise.all([
    hasConnectedGoogleCalendar(user.id),
    getMyAvailability(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-xl font-semibold">Availability</h1>

      <div className="mt-4">
        {!calendarConnected ? (
          <a
            href="/api/integrations/google/connect"
            className="inline-block w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Connect Google Calendar
          </a>
        ) : (
          <p className="text-sm text-black/60 dark:text-white/60">Google Calendar connected.</p>
        )}
      </div>

      <div className="mt-6">
        <AvailabilityManager windows={availability} />
      </div>
    </div>
  );
}
