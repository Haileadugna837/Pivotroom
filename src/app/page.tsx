import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        Book a session with an expert
      </h1>
      <p className="max-w-md text-black/60 dark:text-white/60">
        1:1 video calls with experts, scheduled straight to Google Calendar.
      </p>
      <Link
        href="/experts"
        className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        Find an expert
      </Link>
    </div>
  );
}
