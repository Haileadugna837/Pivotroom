import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { GoogleButton } from "@/features/auth/components/google-button";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-xl font-semibold">Sign in to Pivotroom.africa</h1>
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
        <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
        or
        <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
      </div>
      <LoginForm next={next} />
      <p className="text-sm text-black/60 dark:text-white/60">
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>
      <p className="text-sm text-black/60 dark:text-white/60">
        No account?{" "}
        <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
