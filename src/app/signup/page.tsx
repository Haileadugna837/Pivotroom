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
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-xl font-semibold">Create your Pivotroom.africa account</h1>
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
        or
        <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      </div>
      <SignupForm next={next} />
      <p className="text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
