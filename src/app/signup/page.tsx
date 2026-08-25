import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";
import { GoogleButton } from "@/features/auth/components/google-button";

export const metadata: Metadata = {
  title: "Create your account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-[70vh] flex-col justify-center bg-pivot-paper px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-xl font-semibold text-pivot-ink">Create your Pivotroom.africa account</h1>
        <GoogleButton next={next} />
        <div className="flex items-center gap-3 text-xs text-pivot-muted">
          <div className="h-px flex-1 bg-pivot-line" />
          or
          <div className="h-px flex-1 bg-pivot-line" />
        </div>
        <SignupForm next={next} />
        <p className="text-sm text-pivot-ink-2">
          Already have an account?{" "}
          <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
