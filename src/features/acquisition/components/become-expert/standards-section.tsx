const STANDARDS = [
  { n: "01", title: "Specific experience", copy: "You can point to situations you have actually navigated, not only subjects you have studied." },
  { n: "02", title: "Useful judgment", copy: "You know how to ask good questions, understand context and help someone make a better decision." },
  { n: "03", title: "Professional reliability", copy: "You respect booked time, communicate clearly and treat private client context responsibly." },
  { n: "04", title: "No hard selling", copy: "Sessions are for helping the client think and move forward, not turning every conversation into a sales pitch." },
];

export function BecomeExpertStandards() {
  return (
    <section className="bg-pivot-ink px-6 py-24 text-pivot-paper">
      <div className="mx-auto grid w-full max-w-[1420px] gap-14 lg:grid-cols-[0.55fr_1.45fr]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-70">The standard</div>
          <h2 className="mt-2.5 font-serif text-[40px] leading-[0.93] sm:text-[54px]">
            What makes a strong Pivotroom expert.
          </h2>
        </div>

        <div className="border-t border-pivot-paper/45">
          {STANDARDS.map((item) => (
            <div key={item.n} className="grid grid-cols-[36px_1fr] gap-5 border-b border-pivot-paper/20 py-5">
              <span className="text-[11px] opacity-55">{item.n}</span>
              <div>
                <h3 className="font-serif text-[24px] leading-none font-normal">{item.title}</h3>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed opacity-70">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
