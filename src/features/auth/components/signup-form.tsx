"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";

export function SignupForm({ next }: { next?: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const callbackUrl = next
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: callbackUrl,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    posthog.capture("user_signed_up");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm">
        Check your email to confirm your account before signing in.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        required
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        type="email"
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-md border border-black/10 px-3 py-2 text-sm dark:border-white/15"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
