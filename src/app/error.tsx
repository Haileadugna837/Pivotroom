"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 bg-pivot-paper px-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <h1 className="font-serif text-4xl font-normal text-pivot-ink">Something went wrong</h1>
        <p className="text-pivot-ink-2">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="rounded-full bg-pivot-ink px-6 py-3 text-sm font-medium text-pivot-paper"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
