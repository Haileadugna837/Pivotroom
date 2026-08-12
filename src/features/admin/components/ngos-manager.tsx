import { createNgo, deleteNgo } from "@/features/admin/server/actions";

type Ngo = { id: string; name: string };

export function NgosManager({ ngos }: { ngos: Ngo[] }) {
  return (
    <div className="flex flex-col gap-6">
      <form action={createNgo} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          NGO name
          <input
            name="name"
            required
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Add
        </button>
      </form>

      {ngos.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No NGOs added yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ngos.map((ngo) => (
            <li
              key={ngo.id}
              className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/15"
            >
              <span>{ngo.name}</span>
              <form action={deleteNgo}>
                <input type="hidden" name="id" value={ngo.id} />
                <button className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
