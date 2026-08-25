"use client";

import { useEffect, useState } from "react";

const ADMIN_EMAIL = "haile12adugna@gmail.com";

type IconName =
  | "user"
  | "briefcase"
  | "megaphone"
  | "calendar"
  | "card"
  | "flag"
  | "bulb"
  | "dots"
  | "handshake";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    user: (
      <>
        <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3.5 16.5c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="6.5" width="14" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 6.5V5a2 2 0 012-2h2a2 2 0 012 2v1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10.5h14" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    megaphone: (
      <>
        <path
          d="M3 8.5v3l4 1.2V7.3L3 8.5z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M7 7.3l8-3v11.4l-8-3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M5.5 12.7l1 3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4.5" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    card: (
      <>
        <rect x="2.5" y="5" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
    flag: (
      <>
        <path d="M5 3v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 4h9l-2.5 3L14 10H5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    bulb: (
      <>
        <path
          d="M10 3a5 5 0 00-3 9c.6.5 1 1.2 1 2v.5h4V14c0-.8.4-1.5 1-2a5 5 0 00-3-9z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M8.5 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    dots: (
      <>
        <circle cx="5" cy="10" r="1.3" fill="currentColor" />
        <circle cx="10" cy="10" r="1.3" fill="currentColor" />
        <circle cx="15" cy="10" r="1.3" fill="currentColor" />
      </>
    ),
    handshake: (
      <>
        <path d="M2.5 9.5l3-2.5 3 2 3-2 3 2 2.5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 8v4.5l3.5 3 2-1.5M16 8v4.5l-3.5 3-2-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  };

  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

type Option = {
  key: string;
  icon: IconName;
  title: string;
  subtitle: string;
  subject: string;
};

type Audience = {
  key: string;
  icon: IconName;
  title: string;
  subtitle: string;
  topics: Option[];
};

const AUDIENCES: Audience[] = [
  {
    key: "client",
    icon: "user",
    title: "I'm a client",
    subtitle: "Booking, payments, or a session I've had",
    topics: [
      {
        key: "booking",
        icon: "calendar",
        title: "Help with a booking",
        subtitle: "Scheduling, rescheduling, or session details",
        subject: "Client · Booking Help",
      },
      {
        key: "payment",
        icon: "card",
        title: "Payment or billing",
        subtitle: "Charges, receipts, or a payment that didn't go through",
        subject: "Client · Payment Question",
      },
      {
        key: "problem",
        icon: "flag",
        title: "Report a problem",
        subtitle: "Something went wrong with an expert or a session",
        subject: "Client · Report a Problem",
      },
      {
        key: "other",
        icon: "dots",
        title: "Something else",
        subtitle: "Anything not covered above",
        subject: "Client · General Inquiry",
      },
    ],
  },
  {
    key: "expert",
    icon: "briefcase",
    title: "I'm an expert",
    subtitle: "My profile, payouts, or listing on Pivotroom",
    topics: [
      {
        key: "profile",
        icon: "user",
        title: "Profile or listing help",
        subtitle: "Getting approved, editing details, or your photo",
        subject: "Expert · Profile Help",
      },
      {
        key: "payouts",
        icon: "card",
        title: "Payments & payouts",
        subtitle: "Bank details, payout status, or earnings",
        subject: "Expert · Payouts",
      },
      {
        key: "feature",
        icon: "bulb",
        title: "Feature request",
        subtitle: "An idea that would make Pivotroom better",
        subject: "Expert · Feature Request",
      },
      {
        key: "other",
        icon: "dots",
        title: "Something else",
        subtitle: "Anything not covered above",
        subject: "Expert · General Inquiry",
      },
    ],
  },
  {
    key: "other",
    icon: "megaphone",
    title: "Press, partnerships, or other",
    subtitle: "Media inquiries, collaborations, and everything else",
    topics: [
      {
        key: "media",
        icon: "megaphone",
        title: "Media or press",
        subtitle: "Interview requests or press inquiries",
        subject: "Press Inquiry",
      },
      {
        key: "partnership",
        icon: "handshake",
        title: "Partnership",
        subtitle: "Collaborations or business inquiries",
        subject: "Partnership Inquiry",
      },
      {
        key: "feature",
        icon: "bulb",
        title: "Feature request",
        subtitle: "An idea that would make Pivotroom better",
        subject: "Feature Request",
      },
      {
        key: "other",
        icon: "dots",
        title: "Something else",
        subtitle: "Anything not covered above",
        subject: "General Inquiry",
      },
    ],
  },
];

type Step = "audience" | "topic" | "contact";

function OptionRow({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-pivot-line px-4 py-3 text-left hover:bg-pivot-paper-2"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pivot-paper-2 text-pivot-ink-2">
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-pivot-ink">{title}</span>
        <span className="block text-xs text-pivot-muted">{subtitle}</span>
      </span>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-pivot-muted">
        <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function ContactUsModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("audience");
  const [audience, setAudience] = useState<Audience | null>(null);
  const [topic, setTopic] = useState<Option | null>(null);

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

  const stepNumber = step === "audience" ? 1 : step === "topic" ? 2 : 3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact us"
        className="flex max-h-[85vh] w-full flex-col rounded-t-2xl bg-pivot-white text-pivot-ink sm:max-w-md sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-pivot-line px-5 py-4">
          <div className="flex items-center gap-2">
            {step !== "audience" && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Back"
                className="text-pivot-muted hover:text-pivot-ink"
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
            <div>
              <h2 className="text-lg font-semibold">Contact us</h2>
              <p className="text-xs text-pivot-muted">Step {stepNumber} of 3</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-pivot-muted hover:text-pivot-ink"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "audience" && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">Which of these best describes you?</p>
              <div className="flex flex-col gap-2">
                {AUDIENCES.map((a) => (
                  <OptionRow
                    key={a.key}
                    icon={a.icon}
                    title={a.title}
                    subtitle={a.subtitle}
                    onClick={() => {
                      setAudience(a);
                      setTopic(null);
                      setStep("topic");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === "topic" && audience && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium">What can we help you with?</p>
              <div className="flex flex-col gap-2">
                {audience.topics.map((t) => (
                  <OptionRow
                    key={t.key}
                    icon={t.icon}
                    title={t.title}
                    subtitle={t.subtitle}
                    onClick={() => {
                      setTopic(t);
                      setStep("contact");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === "contact" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-pivot-ink-2">
                Got it{topic ? ` — ${topic.title.toLowerCase()}` : ""}. Here&apos;s the fastest way to
                reach us:
              </p>

              <div className="rounded-lg border border-pivot-line p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-pivot-muted">Email</p>
                <a href={mailtoHref} className="mt-1 block text-sm font-medium text-pivot-ink underline">
                  {ADMIN_EMAIL}
                </a>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-pivot-muted">Phone</p>
                <p className="mt-1 text-sm text-pivot-ink-2">
                  Not listed yet — email is the fastest way to reach us.
                </p>
              </div>

              <p className="text-xs text-pivot-muted">
                We&apos;ve pre-filled the subject line so your message reaches the right place. We
                typically reply within 1–2 business days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
