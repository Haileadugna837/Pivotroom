"use client";

import { useMemo, useState } from "react";
import { updateUserName, setUserAccountStatus } from "@/features/admin/server/actions";

type User = {
  id: string;
  email: string;
  full_name: string | null;
  account_status: string;
  created_at: string;
  expertStatus: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  active: "text-emerald-700 dark:text-emerald-400",
  restricted: "text-amber-700 dark:text-amber-400",
  suspended: "text-red-700 dark:text-red-400",
};

export function UsersView({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.full_name ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email…"
        className="w-full max-w-sm rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />

      <p className="text-xs text-black/50 dark:text-white/50">
        {results.length} {results.length === 1 ? "user" : "users"}
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No users found.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </ul>
      )}
    </div>
  );
}

function UserRow({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {editing ? (
            <form
              action={async (formData) => {
                await updateUserName(formData);
                setEditing(false);
              }}
              className="flex items-center gap-2"
            >
              <input type="hidden" name="id" value={user.id} />
              <input
                name="full_name"
                defaultValue={user.full_name ?? ""}
                autoFocus
                className="rounded-md border border-black/10 px-2 py-1 text-sm dark:border-white/15"
              />
              <button type="submit" className="text-xs underline">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="text-xs text-black/50 underline dark:text-white/50">
                Cancel
              </button>
            </form>
          ) : (
            <p className="flex items-center gap-2 font-medium">
              {user.full_name ?? "(no name)"}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs font-normal text-black/50 underline hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                Edit
              </button>
            </p>
          )}
          <p className="text-black/50 dark:text-white/50">{user.email}</p>
          <p className="mt-1 text-xs text-black/40 dark:text-white/40">
            {user.expertStatus ? `Expert (${user.expertStatus})` : "Client"} · joined{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-xs font-medium capitalize ${STATUS_STYLE[user.account_status] ?? ""}`}>
            {user.account_status}
          </span>
          <div className="flex gap-2">
            {user.account_status !== "active" && (
              <form action={setUserAccountStatus}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="status" value="active" />
                <button className="rounded-md border border-black/10 px-2.5 py-1 text-xs dark:border-white/15">
                  Reactivate
                </button>
              </form>
            )}
            {user.account_status !== "restricted" && (
              <form action={setUserAccountStatus}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="status" value="restricted" />
                <button className="rounded-md border border-black/10 px-2.5 py-1 text-xs dark:border-white/15">
                  Restrict
                </button>
              </form>
            )}
            {user.account_status !== "suspended" && (
              <form action={setUserAccountStatus}>
                <input type="hidden" name="id" value={user.id} />
                <input type="hidden" name="status" value="suspended" />
                <button className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 dark:border-red-900 dark:text-red-400">
                  Suspend
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
