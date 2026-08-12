"use client";

import { useEffect, useState } from "react";

const ADMIN_EMAIL = "haile12adugna@gmail.com";

const AUDIENCES = [
  { key: "client", label: "A client looking to book a session" },
  { key: "expert", label: "An expert on Pivotroom" },
  { key: "other", label: "Just visiting / something else" },
];

const TOPICS = [
  { key: "media", label: "Media / press inquiry", subject: "Media Inquiry" },
  { key: "feature", label: "Requesting a feature", subject: "Feature Request" },
  { key: "support", label: "Need usage support", subject: "Usage Support" },
  { key: "dispute", label: "Submit a dispute", subject: "Dispute" },
  { key: "other", label: "Something else", subject: "General Inquiry" },
];

type Step = "audience" | "topic" | "contact";

const optionButtonBase =
  "w-full rounded-lg border border-black/10 px-4 py-3 text-left text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10";

export function ContactUsModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("audience");
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number] | null>(null);
  const [topic, setTopic] = useState<(typeof TOPICS)[number] | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function goBack() {
    if (step === "topic") setStep("audience");
    else if (step === "contact") setStep("topic");
  }

  const mailtoHref = topic
    ? `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(`[${topic.subject}] Pivotroom contact`)}`
    : `mailto:${ADMIN_EMAIL}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact us"
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-background sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/15">
          <div className="flex items-center gap-2">
            {step !== "audience" && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Back"
                className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M12 4l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <h2 className="text-lg font-semibold">Contact us</h2>
          </div>
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

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "audience" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Are you...?</p>
              <div className="flex flex-col gap-2">
                {AUDIENCES.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      setAudience(a);
                      setStep("topic");
                    }}
                    className={optionButtonBase}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "topic" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">What do you need help with?</p>
              <div className="flex flex-col gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => {
                      setTopic(t);
                      setStep("contact");
                    }}
                    className={optionButtonBase}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "contact" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-black/60 dark:text-white/60">
                {audience ? `Thanks — as ${audience.label.toLowerCase()}, ` : ""}
                here&apos;s the fastest way to reach us
                {topic ? ` about ${topic.label.toLowerCase()}` : ""}:
              </p>

              <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
                <p className="text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
                  Email
                </p>
                <a href={mailtoHref} className="mt-1 block text-sm font-medium underline">
                  {ADMIN_EMAIL}
                </a>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
                  Phone
                </p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  Not listed yet — email is fastest.
                </p>
              </div>

              <p className="text-xs text-black/50 dark:text-white/50">
                We typically respond within 1–2 business days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
