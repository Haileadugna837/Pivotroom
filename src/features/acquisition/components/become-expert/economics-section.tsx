const MONEY_ROWS = [
  { label: "Platform-sourced booking", value: "20% platform commission, including transaction fees" },
  { label: "Your own referral link", note: "Coming soon", value: "13% platform commission" },
  { label: "Session lengths", value: "15 / 30 / 45 / 60 / 90 min" },
  { label: "Session format", value: "Online or approved in-person" },
];

export function BecomeExpertEconomics() {
  return (
    <section className="bg-pivot-olive px-6 py-24 text-pivot-white">
      <div className="mx-auto grid w-full max-w-[1180px] gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-80">Simple economics</div>
          <h2 className="mt-3.5 font-serif text-[40px] leading-[0.95] sm:text-[54px]">
            Your time. Your price. Clear platform terms.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed opacity-85">
            Experts decide their base session price and availability. Pivotroom earns when the platform creates the
            booking, with transaction fees already included in the platform commission.
          </p>
        </div>

        <div>
          <div className="border-t border-pivot-white/35">
            {MONEY_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 border-b border-pivot-white/20 py-4 text-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span>
                  {row.label}
                  {row.note && (
                    <em className="ml-2 text-[10px] font-normal tracking-[0.12em] text-pivot-white/70 not-italic uppercase">
                      {row.note}
                    </em>
                  )}
                </span>
                <strong className="text-sm font-medium">{row.value}</strong>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] leading-relaxed opacity-65">
            Taxes, withholding, payout rules and final commercial terms appear transparently during expert
            onboarding and in the expert agreement.
          </p>
        </div>
      </div>
    </section>
  );
}
