"use client";

import { useState } from "react";
import { submitNominationAnonymous } from "@/features/acquisition/server/actions";

export function NominationForm({
  sessionId,
  leadId,
  onSubmitted,
  onSkip,
}: {
  sessionId: string;
  leadId?: string;
  onSubmitted?: () => void;
  onSkip?: () => void;
}) {
  const [nomineeName, setNomineeName] = useState("");
  const [company, setCompany] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nomineeName.trim() && !description.trim()) {
      setError("Add a name or describe who you're looking for.");
      return;
    }
    setError(null);
    setPending(true);
    const result = await submitNominationAnonymous(sessionId, {
      nomineeName: nomineeName || undefined,
      company: company || undefined,
      socialUrl: socialUrl || undefined,
      topic: topic || undefined,
      description: description || undefined,
      leadId,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
    onSubmitted?.();
  }

  if (submitted) {
    return (
      <p className="text-sm text-black/60 dark:text-white/60">
        Thanks — we&apos;ll factor this into who we recruit next.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="text-sm">
        Person&apos;s name (optional)
        <input
          value={nomineeName}
          onChange={(e) => setNomineeName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
        />
      </label>
      <label className="text-sm">
        Company / Organization (optional)
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
        />
      </label>
      <label className="text-sm">
        Social profile / website (optional)
        <input
          value={socialUrl}
          onChange={(e) => setSocialUrl(e.target.value)}
          type="url"
          className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
        />
      </label>
      <label className="text-sm">
        What would you want to speak with them about? (optional)
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
        />
      </label>
      <label className="text-sm">
        Or describe the type of person you&apos;re looking for
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Founder who has raised investment in Ethiopia."
          className="mt-1 block w-full resize-none rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
        />
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Nominate"}
        </button>
        {onSkip && (
          <button type="button" onClick={onSkip} className="w-full py-2 text-sm text-black/50 dark:text-white/50">
            Skip
          </button>
        )}
      </div>
    </form>
  );
}
