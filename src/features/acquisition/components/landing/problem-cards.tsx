import { PROBLEM_CARDS, type ProblemCard } from "@/features/acquisition/config";

export function AcquisitionProblemCards({ onSelect }: { onSelect: (card: ProblemCard) => void }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">What are you trying to figure out?</h2>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PROBLEM_CARDS.map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card)}
            className="rounded-xl border border-black/10 px-4 py-5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            {card.label}
          </button>
        ))}
      </div>
    </section>
  );
}
