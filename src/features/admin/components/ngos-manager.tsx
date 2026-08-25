"use client";

import { useActionState, useState } from "react";
import { createNgo, deleteNgo, type CreateNgoState } from "@/features/admin/server/actions";
import { PhotoUploadField } from "@/features/experts/components/photo-upload-field";

type Ngo = {
  id: string;
  name: string;
  logo_url: string | null;
  legal_license_url: string | null;
  payout_account_name: string | null;
  payout_account_number: string | null;
};

const initialState: CreateNgoState = {};

export function NgosManager({ ngos }: { ngos: Ngo[] }) {
  const [state, formAction, pending] = useActionState(createNgo, initialState);

  return (
    <div className="flex flex-col gap-8">
      <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-pivot-line p-4">
        <p className="text-sm font-medium text-pivot-ink">Add an NGO</p>

        <PhotoUploadField name="logo" label="Logo" />

        <label className="text-sm text-pivot-ink">
          Name
          <input
            name="name"
            required
            className="mt-1 block w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
        </label>
        <label className="text-sm text-pivot-ink">
          Legal license link
          <input
            name="legal_license_url"
            type="url"
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm text-pivot-ink">
            Payout account name
            <input
              name="payout_account_name"
              className="mt-1 block w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
            />
          </label>
          <label className="text-sm text-pivot-ink">
            Payout account number
            <input
              name="payout_account_number"
              className="mt-1 block w-full rounded-md border border-pivot-line bg-pivot-paper px-3 py-2 text-sm text-pivot-ink outline-none"
            />
          </label>
        </div>

        {state.error && <p className="text-sm text-pivot-danger">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-fit rounded-md bg-pivot-ink px-4 py-2 text-sm font-medium text-pivot-paper disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add NGO"}
        </button>
      </form>

      {ngos.length === 0 ? (
        <p className="text-sm text-pivot-muted">No NGOs added yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ngos.map((ngo) => (
            <NgoRow key={ngo.id} ngo={ngo} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NgoRow({ ngo }: { ngo: Ngo }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-lg border border-pivot-line">
      <div className="flex items-center justify-between gap-3 px-3 py-2">
        <div className="flex items-center gap-3">
          {ngo.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ngo.logo_url} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pivot-paper-2 text-xs font-medium text-pivot-muted">
              {ngo.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-pivot-ink">{ngo.name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-pivot-muted hover:text-pivot-ink"
          >
            {open ? "Hide details" : "Details"}
          </button>
          <form action={deleteNgo}>
            <input type="hidden" name="id" value={ngo.id} />
            <button className="text-pivot-muted hover:text-pivot-ink">
              Remove
            </button>
          </form>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-1 border-t border-pivot-line px-3 py-2.5 text-xs text-pivot-ink-2">
          <p>
            Legal license:{" "}
            {ngo.legal_license_url ? (
              <a href={ngo.legal_license_url} target="_blank" rel="noopener noreferrer" className="underline">
                {ngo.legal_license_url}
              </a>
            ) : (
              "Not provided"
            )}
          </p>
          <p>Payout account name: {ngo.payout_account_name ?? "Not provided"}</p>
          <p>Payout account number: {ngo.payout_account_number ?? "Not provided"}</p>
        </div>
      )}
    </li>
  );
}
