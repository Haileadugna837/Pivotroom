import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getMyNominations } from "@/features/nominations/server/queries";
import { MyNominationsList } from "@/features/nominations/components/my-nominations-list";

export default async function MyNominationsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const nominations = await getMyNominations(user.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">My Nominations</h1>
        <a
          href="/nominate"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Nominate someone
        </a>
      </div>
      <MyNominationsList nominations={nominations} />
    </div>
  );
}
