const FAQS = [
  {
    q: "Do I need to be a consultant?",
    a: "No. Pivotroom is built for experienced people, not only professional consultants. Founders, executives, investors and operators can participate while continuing their main work.",
  },
  {
    q: "How much time do I need to commit?",
    a: "You control your availability. A small starting commitment, even around one hour per month, can be enough.",
  },
  {
    q: "Can I choose my own price?",
    a: "Yes. Experts set their base price, subject to the platform's final onboarding rules and displayed fee structure.",
  },
  {
    q: "Can I offer in-person sessions?",
    a: "Yes, where supported. In-person sessions should use approved professional or public locations rather than private homes.",
  },
  {
    q: "Does every application get accepted?",
    a: "No. Pivotroom is curated. Applications are reviewed for credibility, specificity, reliability and whether the experience is useful to the marketplace.",
  },
  {
    q: "What if I want to donate some sessions?",
    a: "The platform can support optional donated or impact-oriented sessions as part of the expert's availability and profile settings.",
  },
];

export function BecomeExpertFaq() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto grid w-full max-w-[1420px] gap-14 lg:grid-cols-[0.55fr_1.45fr]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-pivot-ink uppercase">Questions</div>
          <h2 className="mt-2.5 font-serif text-[40px] leading-[0.95] text-pivot-ink sm:text-[54px]">
            Before you apply.
          </h2>
        </div>

        <div className="border-t border-pivot-ink">
          {FAQS.map((item) => (
            <details key={item.q} className="group border-b border-pivot-line py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-[22px] font-normal text-pivot-ink marker:content-none">
                {item.q}
                <span className="shrink-0 text-lg text-pivot-accent transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="max-w-2xl pt-0 pb-5 text-[13px] leading-relaxed text-pivot-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
