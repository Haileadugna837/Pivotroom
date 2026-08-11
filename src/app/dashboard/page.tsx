import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMyExpertProfile, hasConnectedGoogleCalendar } from "@/features/experts/server/self";
import { getMyBookingsAsClient, getMyBookingsAsExpert } from "@/features/booking/server/queries";
import { BookingsList } from "@/features/booking/components/bookings-list";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [expertProfile, clientBookings] = await Promise.all([
    getMyExpertProfile(user.id),
    getMyBookingsAsClient(),
  ]);

  const [calendarConnected, expertBookings] = expertProfile
    ? await Promise.all([hasConnectedGoogleCalendar(user.id), getMyBookingsAsExpert()])
    : [false, []];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-xl font-semibold">Welcome, {user.email}</h1>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Your bookings
        </h2>
        <BookingsList bookings={clientBookings} emptyLabel="You haven't booked a session yet." />
      </section>

      <section className="mt-10 border-t border-black/10 pt-8 dark:border-white/15">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
          Expert account
        </h2>
        {!expertProfile ? (
          <p className="text-sm">
            <Link href="/experts/apply" className="underline">
              Apply to become an expert
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm">
              Status: {expertProfile.is_approved ? "Approved" : "Pending review"}
            </p>
            {expertProfile.is_approved && (
              <>
                {!calendarConnected ? (
                  <a
                    href="/api/integrations/google/connect"
                    className="w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
                  >
                    Connect Google Calendar
                  </a>
                ) : (
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Google Calendar connected.
                  </p>
                )}
                <div>
                  <h3 className="mb-2 text-sm font-medium">Bookings as expert</h3>
                  <BookingsList bookings={expertBookings} emptyLabel="No bookings yet." />
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
