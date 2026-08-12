"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="password"
        required
        minLength={6}
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {loading ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
