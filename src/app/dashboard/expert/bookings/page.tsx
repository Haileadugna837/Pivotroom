import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyExpertProfile } from "@/features/experts/server/self";
import { getMyBookingsAsExpert } from "@/features/booking/server/queries";
import { BookingsList } from "@/features/booking/components/bookings-list";

export default async function ExpertBookingsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const expertProfile = await getMyExpertProfile(user.id);
  if (expertProfile?.status !== "approved") redirect("/dashboard");

  const bookings = await getMyBookingsAsExpert();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-xl font-semibold">Expert Bookings</h1>
      <div className="mt-6">
        <BookingsList bookings={bookings} emptyLabel="No bookings yet." />
      </div>
    </div>
  );
}
