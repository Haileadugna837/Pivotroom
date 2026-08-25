"use client";

import { useRef, useState } from "react";
import { ACQUISITION_CATEGORIES } from "@/features/acquisition/config";
import { getOrCreateAcquisitionSessionId } from "@/features/acquisition/lib/session";
import { recordFunnelEvent, submitEarlyAccessLead, upsertAcquisitionSession } from "@/features/acquisition/server/actions";
import { EarlyAccessSuccessScreen } from "@/features/acquisition/components/funnel/success-screen";

const CATEGORY_BLURBS: Record<string, string> = {
  starting_building: "Business model, launch, early decisions",
  funding_finance: "Fundraising, investment, capital",
  marketing_growth: "Positioning, acquisition, brand",
  sales_expansion: "Revenue, partnerships, new markets",
  leadership_operations: "Teams, management, execution",
  product_technology_ai: "Product, software, systems, AI",
  career_professional: "Career and professional decisions",
  industry_expertise: "Specialized or sector-specific problems",
};

const USER_TYPES = [
  "Founder / business owner",
  "Executive / manager",
  "Professional / employee",
  "Startup team",
  "Student / early career",
  "Other",
];

const URGENCIES = ["As soon as possible", "Within 2 weeks", "Within a month", "Just exploring"];

export function AcquisitionJoinSection({ prefillProblem }: { prefillProblem: string | null }) {
  const [sessionId] = useState(() => getOrCreateAcquisitionSessionId() || null);
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [userType, setUserType] = useState("");
  const [urgency, setUrgency] = useState(URGENCIES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [lastPrefill, setLastPrefill] = useState(prefillProblem);
  const started = useRef(false);

  if (prefillProblem && prefillProblem !== lastPrefill) {
    setLastPrefill(prefillProblem);
    setProblem(prefillProblem);
  }

  function toggleCategory(key: string) {
    if (!started.current && sessionId) {
      started.current = true;
      recordFunnelEvent(sessionId, "user_funnel_started").catch(() => {});
    }
    setCategories((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function handleNextFromCategories() {
    if (categories.length === 0) {
      setError("Choose the closest problem area first.");
      return;
    }
    setError(null);
    if (sessionId) {
      upsertAcquisitionSession({ sessionId, status: "categories_selected", categoriesSelected: categories }).catch(() => {});
      recordFunnelEvent(sessionId, "user_category_selected", { categories }).catch(() => {});
    }
    setStep(1);
  }

  function handleNextFromSituation() {
    if (!problem.trim() || !userType) {
      setError("Fill in what you need help with and who you are.");
      return;
    }
    setError(null);
    if (sessionId) {
      upsertAcquisitionSession({ sessionId, status: "problem_entered", problemTextDraft: problem.trim() }).catch(() => {});
      recordFunnelEvent(sessionId, "user_problem_entered", { user_type: userType, urgency }).catch(() => {});
      recordFunnelEvent(sessionId, "user_contact_started").catch(() => {});
    }
    setStep(2);
  }

  function handleBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    if (!sessionId) return;
    if (!name.trim() || !phone.trim()) {
      setError("Enter your name and phone number.");
      return;
    }
    setError(null);
    setPending(true);
    const result = await submitEarlyAccessLead(sessionId, {
      name,
      phone,
      email: email || undefined,
      categories,
      problemText: problem,
      userType,
      urgency,
      company: company || undefined,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setReferralCode(result.referralCode ?? null);
  }

  return (
    <section id="join" className="border-b border-pivot-line py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 md:grid-cols-[0.75fr_1.25fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-accent uppercase">
            Join early access
          </div>
          <h2 className="mt-2.5 font-serif text-[44px] leading-[0.94] font-normal tracking-[-0.03em] text-pivot-ink sm:text-[60px] md:text-[68px]">
            What are you trying to figure out right now?
          </h2>
          <p className="mt-4 max-w-[450px] leading-relaxed text-pivot-muted">
            Don&apos;t start with an expert name. Start with the problem. We&apos;ll use that to understand what kind
            of experience should be available on Pivotroom.
          </p>
          <div className="mt-7 max-w-[450px] border-t border-pivot-ink pt-4.5 text-xs leading-relaxed text-pivot-ink-2">
            <strong>Your answer matters before launch.</strong>
            <br />
            Early demand helps us prioritize the experts, categories and industries people actually need.
          </div>
        </div>

        <div className="border border-pivot-line bg-pivot-white p-6 shadow-[0_24px_65px_rgba(56,22,21,0.08)] sm:p-8">
          {!referralCode && (
            <div className="mb-7 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1 flex-1 ${i <= step ? "bg-pivot-accent" : "bg-pivot-line"}`} />
              ))}
            </div>
          )}

          {referralCode ? (
            sessionId && <EarlyAccessSuccessScreen sessionId={sessionId} referralCode={referralCode} />
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h3 className="font-serif text-[36px] leading-none font-normal text-pivot-ink sm:text-[40px]">
                    Start with the problem.
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    Choose the closest area. You can explain the exact situation next.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ACQUISITION_CATEGORIES.map((cat) => {
                      const active = categories.includes(cat.key);
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => toggleCategory(cat.key)}
                          className={`min-h-[72px] border px-3.5 py-3 text-left ${
                            active
                              ? "border-pivot-ink bg-pivot-ink text-pivot-paper"
                              : "border-pivot-line text-pivot-ink"
                          }`}
                        >
                          <strong className="block text-xs font-medium">{cat.label}</strong>
                          <span className="mt-1 block text-[10px] leading-snug opacity-70">
                            {CATEGORY_BLURBS[cat.key]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
                  <div className="mt-6 flex justify-between gap-3 border-t border-pivot-line pt-5.5">
                    <span />
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

              {step === 1 && (
                <div>
                  <h3 className="font-serif text-[36px] leading-none font-normal text-pivot-ink sm:text-[40px]">
                    Tell us the real situation.
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    One or two sentences is enough. Specific problems create better matches.
                  </p>
                  <div className="mb-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      What do you want help with?
                    </label>
                    <textarea
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      placeholder="Example: I run a furniture company and I need to improve showroom sales without increasing ad spend..."
                      className="min-h-[120px] w-full resize-y border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Who are you?
                      </label>
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      >
                        <option value="">Select one</option>
                        {USER_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        How soon do you need help?
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      >
                        {URGENCIES.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
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
                      onClick={handleNextFromSituation}
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
                    Where should we reach you?
                  </h3>
                  <p className="mt-2 mb-6 text-[13px] leading-relaxed text-pivot-muted">
                    We&apos;ll use this to notify you when early access opens or a relevant expert becomes available.
                  </p>
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                        Phone / WhatsApp
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        inputMode="tel"
                        placeholder="+251..."
                        className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Email (optional)
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
                    />
                  </div>
                  <div className="mt-4.5">
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.12em] text-pivot-ink uppercase">
                      Company / organization (optional)
                    </label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Where you work or what you're building"
                      className="w-full border border-pivot-line bg-pivot-paper px-3.5 py-3 text-pivot-ink outline-none"
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
                      type="submit"
                      disabled={pending}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-pivot-accent px-[18px] text-sm font-medium text-white disabled:opacity-60"
                    >
                      {pending ? "Submitting…" : "Join early access ↗"}
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
