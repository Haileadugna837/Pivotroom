"use client";

import { useRef, useState } from "react";
import { ACQUISITION_CATEGORIES } from "@/features/acquisition/config";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent, submitBecomeExpertApplication } from "@/features/acquisition/server/actions";

const YEARS_EXPERIENCE_OPTIONS = ["5–9 years", "10–14 years", "15–19 years", "20+ years"];
const AVAILABILITY_OPTIONS = ["1 hour / month", "2–4 hours / month", "1–2 hours / week", "Flexible"];

export function BecomeExpertApplicationForm({
  isLoggedIn,
  userEmail,
}: {
  isLoggedIn: boolean;
  userEmail: string | null;
}) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [company, setCompany] = useState("");
  const [yearsExperienceRange, setYearsExperienceRange] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [problemsSolvedText, setProblemsSolvedText] = useState("");

  const [experienceText, setExperienceText] = useState("");
  const [whyJoinText, setWhyJoinText] = useState("");
  const [preferredPriceEtb, setPreferredPriceEtb] = useState("");
  const [initialAvailability, setInitialAvailability] = useState(AVAILABILITY_OPTIONS[0]);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const started = useRef(false);

  function markStarted() {
    if (started.current || !sessionId) return;
    started.current = true;
    recordFunnelEvent(sessionId, "expert_application_started").catch(() => {});
  }

  function toggleCategory(key: string) {
    setCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleNextFromIdentity() {
    markStarted();
    if (!fullName.trim() || !currentTitle.trim() || !yearsExperienceRange) {
      setError("Fill in your name, current title and years of experience.");
      return;
    }
    if (!isLoggedIn && (!email.trim() || password.length < 6)) {
      setError("Enter an email and a password (at least 6 characters) to create your account.");
      return;
    }
    setError(null);
    if (sessionId) recordFunnelEvent(sessionId, "expert_application_identity_completed").catch(() => {});
    setStep(1);
  }

  function handleNextFromCategories() {
    if (!problemsSolvedText.trim()) {
      setError("Tell us what people should come to you for.");
      return;
    }
    setError(null);
    if (sessionId) recordFunnelEvent(sessionId, "expert_application_categories_completed", { categories }).catch(() => {});
    setStep(2);
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    if (!sessionId) return;
    if (!experienceText.trim() || !whyJoinText.trim()) {
      setError("Tell us about your experience and why you want to join.");
      return;
    }
    setError(null);
    setPending(true);
    const result = await submitBecomeExpertApplication(sessionId, {
      fullName,
      currentTitle,
      company: company || undefined,
      yearsExperienceRange,
      linkedinUrl: linkedinUrl || undefined,
      email: isLoggedIn ? undefined : email,
      password: isLoggedIn ? undefined : password,
      categories,
      problemsSolvedText,
      experienceText,
      whyJoinText,
      preferredPriceEtb: preferredPriceEtb ? Number(preferredPriceEtb) : undefined,
      initialAvailability,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="apply" className="border-b border-pivot-line px-6 py-24">
      <div className="mx-auto grid w-full max-w-[1420px] gap-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Expert application
          </div>
          <h2 className="mt-2.5 font-serif text-[40px] leading-[0.92] text-pivot-ink sm:text-[54px]">
            What should people come to you for?
          </h2>
          <p className="mt-4 max-w-sm leading-relaxed text-pivot-muted">
            Start with the experience that makes you unusually useful. The application is intentionally short.
          </p>
          <div className="mt-7 max-w-sm border-t border-pivot-ink pt-4.5 text-xs leading-relaxed text-pivot-ink-2">
            <strong>Pivotroom is curated.</strong>
            <br />
            Applying does not automatically publish a profile. Applications are reviewed before experts get access
            to build their profile.
          </div>
        </div>

        <div className="border border-pivot-line bg-pivot-white p-6 shadow-[0_22px_65px_rgba(56,22,21,0.08)] sm:p-8">
          {!submitted && (
            <div className="mb-7 flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1 flex-1 ${i <= step ? "bg-pivot-accent" : "bg-pivot-line"}`} />
              ))}
            </div>
          )}

          {submitted ? (
            <div className="py-10">
              <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
                Application received
              </div>
              <h3 className="mt-2.5 font-serif text-[42px] leading-none font-normal text-pivot-ink sm:text-[48px]">
                Thank you for opening the room.
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-pivot-muted">
                {isLoggedIn
                  ? "We'll review your application and email you once a decision is made."
                  : "Check your email to confirm your new account. Once your application is accepted, log in to complete and publish your profile."}
              </p>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h3 className="font-serif text-[34px] leading-none font-normal text-pivot-ink sm:text-[38px]">
                    Start with who you are.
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    Enough context for us to understand your background. You can polish the public profile later.
                  </p>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Full name
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={markStarted}
                        placeholder="Your name"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Current title
                      </label>
                      <input
                        value={currentTitle}
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        placeholder="Founder, CEO, Director…"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Company / organization
                      </label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Current organization"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Years of experience
                      </label>
                      <select
                        value={yearsExperienceRange}
                        onChange={(e) => setYearsExperienceRange(e.target.value)}
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      >
                        <option value="">Select</option>
                        {YEARS_EXPERIENCE_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      LinkedIn or professional URL
                    </label>
                    <input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      type="url"
                      placeholder="https://"
                      className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>

                  {isLoggedIn ? (
                    <p className="mt-4.5 text-xs text-pivot-muted">
                      Applying as <strong className="text-pivot-ink">{userEmail}</strong>.
                    </p>
                  ) : (
                    <div className="mt-6 border-t border-pivot-line pt-5">
                      <p className="mb-3.5 text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Create your account
                      </p>
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                            Email
                          </label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                            Password
                          </label>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            minLength={6}
                            placeholder="At least 6 characters"
                            className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-pivot-muted">
                        Already have a Pivotroom account?{" "}
                        <a href="/login?next=/become-an-expert" className="underline">
                          Log in first
                        </a>
                        , then come back to apply.
                      </p>
                    </div>
                  )}

                  {error && <p className="mt-4 text-sm text-pivot-danger">{error}</p>}
                  <div className="mt-6 flex justify-between gap-3 border-t border-pivot-line pt-5.5">
                    <span />
                    <button
                      type="button"
                      onClick={handleNextFromIdentity}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
                    >
                      Continue ↗
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-serif text-[34px] leading-none font-normal text-pivot-ink sm:text-[38px]">
                    Where are you most useful?
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    Choose the areas where your experience is strongest. This is about what people should actually
                    book you for.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ACQUISITION_CATEGORIES.map((cat) => {
                      const active = categories.includes(cat.key);
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => toggleCategory(cat.key)}
                          className={`min-h-[60px] border px-3.5 py-3 text-left ${
                            active ? "border-pivot-ink bg-pivot-ink text-pivot-paper" : "border-pivot-line text-pivot-ink"
                          }`}
                        >
                          <strong className="block text-xs font-medium">{cat.label}</strong>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      What are 3 problems people should come to you for?
                    </label>
                    <textarea
                      value={problemsSolvedText}
                      onChange={(e) => setProblemsSolvedText(e.target.value)}
                      placeholder="Example: preparing for a seed round; fixing weak B2B positioning; entering the Ethiopian market…"
                      className="min-h-[105px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  {error && <p className="mt-4 text-sm text-pivot-danger">{error}</p>}
                  <div className="mt-6 flex justify-between gap-3 border-t border-pivot-line pt-5.5">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-pivot-ink px-[18px] text-sm font-medium text-pivot-ink"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextFromCategories}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
                    >
                      Continue ↗
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <h3 className="font-serif text-[34px] leading-none font-normal text-pivot-ink sm:text-[38px]">
                    Give us the proof.
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    A few concrete signals are more useful than a long biography.
                  </p>
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Most relevant accomplishment or experience
                    </label>
                    <textarea
                      value={experienceText}
                      onChange={(e) => setExperienceText(e.target.value)}
                      placeholder="What have you built, led, grown, invested in, fixed or learned that makes your advice valuable?"
                      className="min-h-[105px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Why do you want to join Pivotroom?
                    </label>
                    <textarea
                      value={whyJoinText}
                      onChange={(e) => setWhyJoinText(e.target.value)}
                      placeholder="A short answer is enough."
                      className="min-h-[85px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  <div className="mt-4.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Preferred starting price
                      </label>
                      <input
                        value={preferredPriceEtb}
                        onChange={(e) => setPreferredPriceEtb(e.target.value)}
                        type="number"
                        min="0"
                        placeholder="ETB per session"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Initial availability
                      </label>
                      <select
                        value={initialAvailability}
                        onChange={(e) => setInitialAvailability(e.target.value)}
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      >
                        {AVAILABILITY_OPTIONS.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {error && <p className="mt-4 text-sm text-pivot-danger">{error}</p>}
                  <div className="mt-6 flex justify-between gap-3 border-t border-pivot-line pt-5.5">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-pivot-ink px-[18px] text-sm font-medium text-pivot-ink"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-accent px-[18px] text-sm font-medium text-white disabled:opacity-60"
                    >
                      {pending ? "Submitting…" : "Submit application ↗"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
