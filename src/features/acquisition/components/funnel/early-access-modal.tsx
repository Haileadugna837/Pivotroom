"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ACQUISITION_CATEGORIES } from "@/features/acquisition/config";
import { recordFunnelEvent, submitEarlyAccessLead, upsertAcquisitionSession } from "@/features/acquisition/server/actions";
import { EarlyAccessSuccessScreen } from "@/features/acquisition/components/funnel/success-screen";

type Step = "categories" | "problem" | "contact" | "success";

export function EarlyAccessFunnel({
  sessionId,
  onClose,
  initialCategories,
}: {
  sessionId: string;
  onClose: () => void;
  // Set when opened from a problem card (spec §14) — pre-selects the
  // matching category and skips straight to the problem step so the
  // visitor isn't asked to pick a category they effectively already did.
  initialCategories?: string[];
}) {
  const [step, setStep] = useState<Step>(initialCategories?.length ? "problem" : "categories");
  const [categories, setCategories] = useState<string[]>(initialCategories ?? []);
  const [problem, setProblem] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    recordFunnelEvent(sessionId, "user_funnel_started").catch(() => {});
    if (initialCategories?.length) {
      upsertAcquisitionSession({ sessionId, status: "categories_selected", categoriesSelected: initialCategories }).catch(() => {});
      recordFunnelEvent(sessionId, "user_category_selected", { categories: initialCategories, source: "problem_card" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function toggleCategory(key: string) {
    setCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleContinueFromCategories() {
    upsertAcquisitionSession({ sessionId, status: "categories_selected", categoriesSelected: categories }).catch(() => {});
    recordFunnelEvent(sessionId, "user_category_selected", { categories }).catch(() => {});
    setStep("problem");
  }

  function handleContinueFromProblem() {
    if (problem.trim()) {
      upsertAcquisitionSession({ sessionId, status: "problem_entered", problemTextDraft: problem.trim() }).catch(() => {});
      recordFunnelEvent(sessionId, "user_problem_entered").catch(() => {});
    }
    goToContact();
  }

  function handleSkipProblem() {
    goToContact();
  }

  function goToContact() {
    recordFunnelEvent(sessionId, "user_contact_started").catch(() => {});
    setStep("contact");
  }

  async function handleSubmit() {
    setError(null);
    setPending(true);
    const result = await submitEarlyAccessLead(sessionId, {
      name,
      phone,
      email: email || undefined,
      categories,
      problemText: problem || undefined,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setReferralCode(result.referralCode ?? null);
    setLeadId(result.leadId);
    setStep("success");
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {step !== "success" && (
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/15">
          <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            {step === "categories" ? "1 of 3" : step === "problem" ? "2 of 3" : "3 of 3"}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {step === "categories" && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
          <h2 className="text-xl font-semibold">What would you like help with?</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">Select all that apply.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ACQUISITION_CATEGORIES.map((c) => {
              const active = categories.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCategory(c.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-black/10 text-black/70 hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleContinueFromCategories}
            disabled={categories.length === 0}
            className="mt-auto w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === "problem" && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
          <h2 className="text-xl font-semibold">What would you love to ask someone who&apos;s already done it?</h2>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="How do I expand my business outside Ethiopia?"
            rows={5}
            className="mt-6 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
          />
          <div className="mt-auto flex flex-col gap-2">
            <button
              type="button"
              onClick={handleContinueFromProblem}
              className="w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
            >
              Continue
            </button>
            <button type="button" onClick={handleSkipProblem} className="w-full py-2 text-sm text-black/50 dark:text-white/50">
              Skip
            </button>
          </div>
        </div>
      )}

      {step === "contact" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8"
        >
          <h2 className="text-xl font-semibold">Get Early Access</h2>
          <div className="mt-6 flex flex-col gap-4">
            <label className="text-sm">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Phone / WhatsApp
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="09XX XXX XXX"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Email (optional)
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                autoComplete="email"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <p className="mt-6 text-xs text-black/40 dark:text-white/40">
            By continuing you agree to Pivotroom&apos;s{" "}
            <Link href="/terms" className="underline" target="_blank">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline" target="_blank">
              Privacy Policy
            </Link>
            . We&apos;ll use this to reach you about early access.
          </p>

          <button
            type="submit"
            disabled={pending}
            className="mt-auto w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background disabled:opacity-50"
          >
            {pending ? "Submitting…" : "Get Early Access"}
          </button>
        </form>
      )}

      {step === "success" && referralCode && (
        <EarlyAccessSuccessScreen sessionId={sessionId} referralCode={referralCode} leadId={leadId} onClose={onClose} />
      )}
    </div>
  );
}
