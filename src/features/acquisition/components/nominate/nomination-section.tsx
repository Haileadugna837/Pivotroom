"use client";

import { useRef, useState } from "react";
import { ACQUISITION_CATEGORIES } from "@/features/acquisition/config";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent, submitNominationAnonymous } from "@/features/acquisition/server/actions";

const CATEGORY_BLURBS: Record<string, string> = {
  starting_building: "Founding, business model, launch",
  funding_finance: "Capital, fundraising, investment",
  marketing_growth: "Brand, demand, acquisition",
  sales_expansion: "Revenue, partnerships, new markets",
  leadership_operations: "Teams, management, execution",
  product_technology_ai: "Product, systems, software, AI",
  career_professional: "Senior professional decisions",
  industry_expertise: "Deep sector knowledge",
};

const RELATIONSHIPS = [
  "Worked with them",
  "Worked for them",
  "Business partner",
  "Client / customer",
  "Friend / personal connection",
  "Know them professionally",
  "Follow their work",
  "Other",
];

const INTRO_COMFORT_OPTIONS = [
  "Yes, if they are selected",
  "Maybe — ask me first",
  "No, please contact them directly",
];

export function NominateSection() {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [step, setStep] = useState(0);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeTitle, setNomineeTitle] = useState("");
  const [company, setCompany] = useState("");
  const [nomineeLocation, setNomineeLocation] = useState("");
  const [socialUrl, setSocialUrl] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [topic, setTopic] = useState("");
  const [nominatorName, setNominatorName] = useState("");
  const [nominatorPhone, setNominatorPhone] = useState("");
  const [nominatorEmail, setNominatorEmail] = useState("");
  const [nominatorRelationship, setNominatorRelationship] = useState("");
  const [introComfort, setIntroComfort] = useState(INTRO_COMFORT_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const started = useRef(false);

  function markStarted() {
    if (started.current || !sessionId) return;
    started.current = true;
    recordFunnelEvent(sessionId, "nomination_started").catch(() => {});
  }

  function toggleCategory(key: string) {
    setCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleNextFromNominee() {
    markStarted();
    if (!nomineeName.trim()) {
      setError("Enter who you're nominating.");
      return;
    }
    setError(null);
    if (sessionId) recordFunnelEvent(sessionId, "nomination_nominee_completed").catch(() => {});
    setStep(1);
  }

  function handleNextFromContext() {
    if (!reason.trim()) {
      setError("Tell us why you're nominating this person.");
      return;
    }
    setError(null);
    if (sessionId) recordFunnelEvent(sessionId, "nomination_context_completed", { categories }).catch(() => {});
    setStep(2);
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    if (!sessionId) return;
    if (!nominatorName.trim() || !nominatorPhone.trim() || !nominatorRelationship) {
      setError("Fill in your name, phone, and relationship to them.");
      return;
    }
    setError(null);
    setPending(true);
    const result = await submitNominationAnonymous(sessionId, {
      nomineeName,
      nomineeTitle: nomineeTitle || undefined,
      company: company || undefined,
      nomineeLocation: nomineeLocation || undefined,
      socialUrl: socialUrl || undefined,
      categories,
      reason,
      topic: topic || undefined,
      nominatorName,
      nominatorPhone,
      nominatorEmail: nominatorEmail || undefined,
      nominatorRelationship,
      introComfort,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="nominate" className="border-t border-b border-pivot-line bg-pivot-paper-2 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1420px] gap-14 px-6 md:grid-cols-[0.72fr_1.28fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Nominate someone
          </div>
          <h2 className="mt-2.5 font-serif text-[44px] leading-[0.93] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[60px] md:text-[68px]">
            Tell us who belongs in the room.
          </h2>
          <p className="mt-4 max-w-[460px] leading-relaxed text-pivot-muted">
            You do not need perfect information. Give us enough context to understand who they are and why people
            should be able to talk to them.
          </p>
          <div className="mt-7 max-w-[460px] border-t border-pivot-ink pt-4.5 text-xs leading-relaxed text-pivot-ink-2">
            <strong>A nomination is a recommendation, not an enrollment.</strong>
            <br />
            Pivotroom reviews nominations independently and contacts selected people before any public profile is
            created.
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
                Nomination received
              </div>
              <h3 className="mt-2.5 font-serif text-[42px] leading-none font-normal text-pivot-ink sm:text-[50px]">
                Thank you for helping build the room.
              </h3>
              <p className="mt-3 leading-relaxed text-pivot-muted">
                Pivotroom can now review the person, assess fit and decide whether to approach them. If an
                introduction would help, your team can follow up with the nominator first.
              </p>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h3 className="font-serif text-[36px] leading-none font-normal text-pivot-ink sm:text-[40px]">
                    Who are you nominating?
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    Start with the person. If you only know some of the details, that is okay.
                  </p>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Full name
                      </label>
                      <input
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        onFocus={markStarted}
                        placeholder="Their name"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Current title
                      </label>
                      <input
                        value={nomineeTitle}
                        onChange={(e) => setNomineeTitle(e.target.value)}
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
                        placeholder="Where they work or what they built"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Country / city
                      </label>
                      <input
                        value={nomineeLocation}
                        onChange={(e) => setNomineeLocation(e.target.value)}
                        placeholder="Addis Ababa, Ethiopia"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      LinkedIn / website / public profile (optional)
                    </label>
                    <input
                      value={socialUrl}
                      onChange={(e) => setSocialUrl(e.target.value)}
                      type="url"
                      placeholder="https://"
                      className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
                  <div className="mt-6 flex justify-between gap-3 border-t border-pivot-line pt-5.5">
                    <span />
                    <button
                      type="button"
                      onClick={handleNextFromNominee}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-ink px-[18px] text-sm font-medium text-pivot-paper"
                    >
                      Continue ↗
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="font-serif text-[36px] leading-none font-normal text-pivot-ink sm:text-[40px]">
                    Why should people talk to them?
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    Explain what this person has actually done and the problems they could help others think
                    through.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ACQUISITION_CATEGORIES.map((cat) => {
                      const active = categories.includes(cat.key);
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => toggleCategory(cat.key)}
                          className={`min-h-[68px] border px-3.5 py-3 text-left ${
                            active
                              ? "border-pivot-ink bg-pivot-ink text-pivot-paper"
                              : "border-pivot-line text-pivot-ink"
                          }`}
                        >
                          <strong className="block text-xs font-medium">{cat.label}</strong>
                          <span className="mt-1 block text-[10px] opacity-70">{CATEGORY_BLURBS[cat.key]}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Why are you nominating this person?
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Example: They built one of the strongest distribution networks in the sector and have spent 18 years solving operational problems across Ethiopia..."
                      className="min-h-[115px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      What should someone come to them for?
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="List 2–3 problems or decisions they would be especially useful for."
                      className="min-h-[115px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
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
                      onClick={handleNextFromContext}
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
                  <h3 className="font-serif text-[36px] leading-none font-normal text-pivot-ink sm:text-[40px]">
                    How do you know them?
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    This helps us understand the recommendation and whether you can help with a warm introduction.
                  </p>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Your name
                      </label>
                      <input
                        value={nominatorName}
                        onChange={(e) => setNominatorName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Your phone / WhatsApp
                      </label>
                      <input
                        value={nominatorPhone}
                        onChange={(e) => setNominatorPhone(e.target.value)}
                        type="tel"
                        inputMode="tel"
                        placeholder="+251..."
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Your email (optional)
                      </label>
                      <input
                        value={nominatorEmail}
                        onChange={(e) => setNominatorEmail(e.target.value)}
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Your relationship
                      </label>
                      <select
                        value={nominatorRelationship}
                        onChange={(e) => setNominatorRelationship(e.target.value)}
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      >
                        <option value="">Select one</option>
                        {RELATIONSHIPS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Would you be comfortable making an introduction?
                    </label>
                    <select
                      value={introComfort}
                      onChange={(e) => setIntroComfort(e.target.value)}
                      className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    >
                      {INTRO_COMFORT_OPTIONS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
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
                      {pending ? "Submitting…" : "Submit nomination ↗"}
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
