type WhatToExpectProps = {
  expectations: string[];
  exampleQuestions: string[];
  className?: string;
};

export function WhatToExpect({ expectations, exampleQuestions, className = "" }: WhatToExpectProps) {
  if (expectations.length === 0 && exampleQuestions.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="mb-3 text-sm font-medium">What to expect</h2>

      {expectations.length > 0 && (
        <div className="rounded-xl bg-black/5 p-4 dark:bg-white/10">
          <ul className="flex flex-col gap-1.5 text-sm text-black/70 dark:text-white/70">
            {expectations.map((item, i) => (
              <li key={i}>– {item}</li>
            ))}
          </ul>
        </div>
      )}

      {exampleQuestions.length > 0 && (
        <details className="group mt-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
            Example questions
            <span className="transition-transform group-open:rotate-180" aria-hidden="true">
              ⌄
            </span>
          </summary>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-black/70 dark:text-white/70">
            {exampleQuestions.map((q, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
