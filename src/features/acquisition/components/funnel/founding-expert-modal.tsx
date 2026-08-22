"use client";

import { useEffect, useRef, useState } from "react";
import {
  EXPERTISE_TOPIC_SUGGESTIONS,
  MAX_EXPERTISE_TOPICS,
  PROFESSIONAL_TYPES,
} from "@/features/acquisition/config";
import { recordFunnelEvent, submitFoundingExpertApplication } from "@/features/acquisition/server/actions";

type Step = "contact" | "type" | "expertise" | "experience" | "success";

export function FoundingExpertModal({ sessionId, onClose }: { sessionId: string; onClose: () => void }) {
  const [step, setStep] = useState<Step>("contact");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [professionalType, setProfessionalType] = useState("");
  const [professionalTypeSecondary, setProfessionalTypeSecondary] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [experienceText, setExperienceText] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    recordFunnelEvent(sessionId, "expert_application_started").catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function toggleTopic(topic: string) {
    setTopics((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= MAX_EXPERTISE_TOPICS) return prev;
      return [...prev, topic];
    });
  }

  function addCustomTopic() {
    const trimmed = customTopic.trim();
    if (!trimmed || topics.length >= MAX_EXPERTISE_TOPICS || topics.includes(trimmed)) return;
    setTopics((prev) => [...prev, trimmed]);
    setCustomTopic("");
  }

  function handleContactContinue() {
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      setError("Enter your name and a phone number or email.");
      return;
    }
    setError(null);
    setStep("type");
  }

  function handleTypeContinue() {
    if (!professionalType) {
      setError("Select what best describes you.");
      return;
    }
    setError(null);
    recordFunnelEvent(sessionId, "expert_professional_type_completed", { professional_type: professionalType }).catch(() => {});
    setStep("expertise");
  }

  function handleExpertiseContinue() {
    if (topics.length === 0) {
      setError("Add at least one topic you can speak about.");
      return;
    }
    setError(null);
    recordFunnelEvent(sessionId, "expert_expertise_completed", { topics }).catch(() => {});
    setStep("experience");
  }

  async function handleSubmit() {
    if (!experienceText.trim()) {
      setError("Tell us briefly about your experience.");
      return;
    }
    setError(null);
    setPending(true);
    recordFunnelEvent(sessionId, "expert_contact_completed").catch(() => {});
    const result = await submitFoundingExpertApplication(sessionId, {
      name,
      phone: phone || undefined,
      email: email || undefined,
      professionalType,
      professionalTypeSecondary: professionalTypeSecondary || undefined,
      expertiseTopics: topics,
      experienceText,
      currentRole: currentRole || undefined,
      currentCompany: currentCompany || undefined,
      yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
      linkedinUrl: linkedin || undefined,
      websiteUrl: website || undefined,
      instagramUrl: instagram || undefined,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setStep("success");
  }

  const stepNumber = { contact: 1, type: 2, expertise: 3, experience: 4, success: 4 }[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground">
      {step !== "success" && (
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/15">
          <span className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
            {stepNumber} of 4
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

      {step === "contact" && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-6 py-8">
          <h2 className="text-xl font-semibold">Apply as a Founding Expert</h2>
          <div className="mt-6 flex flex-col gap-4">
            <label className="text-sm">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                inputMode="email"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              LinkedIn (optional)
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                type="url"
                placeholder="https://linkedin.com/in/…"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Website (optional)
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                type="url"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Instagram or other professional profile (optional)
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                type="url"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
          </div>
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="button"
            onClick={handleContactContinue}
            className="mt-6 w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Continue
          </button>
        </div>
      )}

      {step === "type" && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
          <h2 className="text-xl font-semibold">What best describes you?</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {PROFESSIONAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setProfessionalType(t)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  professionalType === t
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/10 text-black/70 hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <label className="mt-6 text-sm">
            Secondary classification (optional)
            <select
              value={professionalTypeSecondary}
              onChange={(e) => setProfessionalTypeSecondary(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
            >
              <option value="">None</option>
              {PROFESSIONAL_TYPES.filter((t) => t !== professionalType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="button"
            onClick={handleTypeContinue}
            className="mt-auto w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Continue
          </button>
        </div>
      )}

      {step === "expertise" && (
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
          <h2 className="text-xl font-semibold">What can people speak with you about?</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">
            Choose up to {MAX_EXPERTISE_TOPICS}, or add your own.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {EXPERTISE_TOPIC_SUGGESTIONS.map((topic) => {
              const active = topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-black/10 text-black/70 hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTopic();
                }
              }}
              placeholder="Add your own topic"
              className="flex-1 rounded-lg border border-black/10 bg-background px-4 py-2.5 text-sm text-foreground dark:border-white/15"
            />
            <button
              type="button"
              onClick={addCustomTopic}
              className="rounded-lg border border-black/10 px-4 py-2.5 text-sm font-medium dark:border-white/15"
            >
              Add
            </button>
          </div>
          {topics.length > 0 && (
            <p className="mt-3 text-xs text-black/50 dark:text-white/50">Selected: {topics.join(", ")}</p>
          )}
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="button"
            onClick={handleExpertiseContinue}
            className="mt-auto w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Continue
          </button>
        </div>
      )}

      {step === "experience" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto px-6 py-8"
        >
          <h2 className="text-xl font-semibold">Tell us briefly about your experience.</h2>
          <textarea
            value={experienceText}
            onChange={(e) => setExperienceText(e.target.value)}
            rows={4}
            className="mt-4 w-full resize-none rounded-xl border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
          />
          <div className="mt-4 flex flex-col gap-4">
            <label className="text-sm">
              Current position (optional)
              <input
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Company (optional)
              <input
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
            <label className="text-sm">
              Years of experience (optional)
              <input
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                className="mt-1 block w-full rounded-lg border border-black/10 bg-background px-4 py-3 text-sm text-foreground dark:border-white/15"
              />
            </label>
          </div>
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background disabled:opacity-50"
          >
            {pending ? "Submitting…" : "Submit Founding Expert Application"}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <h2 className="text-2xl font-semibold">Application received.</h2>
          <p className="mt-3 text-sm text-black/60 dark:text-white/60">
            Our team reviews Founding Expert applications individually. We&apos;ll contact you if we need
            additional information or when your application moves forward.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
          >
            Return Home
          </button>
        </div>
      )}
    </div>
  );
}
