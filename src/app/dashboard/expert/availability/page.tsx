import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfile, hasConnectedGoogleCalendar } from "@/features/experts/server/self";
import { getMyAvailability } from "@/features/booking/server/queries";
import { AvailabilityManager } from "@/features/booking/components/availability-manager";
import { disconnectGoogleCalendar } from "@/features/experts/server/actions";
import { TIMEZONE_OPTIONS } from "@/lib/timezones";

export default async function ExpertAvailabilityPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);
  if (expertProfile?.status !== "approved") redirect("/dashboard");

  const [calendarConnected, availability] = await Promise.all([
    hasConnectedGoogleCalendar(user.id),
    getMyAvailability(),
  ]);

  const timezoneLabel =
    TIMEZONE_OPTIONS.find((tz) => tz.value === expertProfile.timezone)?.label ?? expertProfile.timezone;

  return (
    <div className="mx-auto max-w-2xl bg-pivot-paper px-6 py-10">
      <h1 className="text-xl font-semibold text-pivot-ink">Availability</h1>
      <p className="mt-1 text-sm text-pivot-muted">
        Times below are in your timezone — {timezoneLabel}. Change it on your{" "}
        <a href="/dashboard/expert/profile" className="underline">
          profile
        </a>
        .
      </p>

      <div className="mt-4 flex items-center gap-3">
        {!calendarConnected ? (
          <a
            href="/api/integrations/google/connect"
            className="inline-block w-fit rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper"
          >
            Connect Google Calendar
          </a>
        ) : (
          <>
            <p className="text-sm text-pivot-ink-2">Google Calendar connected.</p>
            <form action={disconnectGoogleCalendar}>
              <button type="submit" className="text-sm text-pivot-muted underline hover:text-pivot-ink">
                Disconnect
              </button>
            </form>
          </>
        )}
      </div>

      <div className="mt-6">
        <AvailabilityManager windows={availability} />
      </div>
    </div>
  );
}
