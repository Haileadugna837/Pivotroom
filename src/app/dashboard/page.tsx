import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-xl font-semibold">Welcome, {user.email}</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Bookings and expert tools will appear here.
      </p>
    </div>
  );
}
