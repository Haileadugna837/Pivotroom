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
    <div className="flex min-h-[70vh] flex-col justify-center bg-pivot-paper px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-xl font-semibold text-pivot-ink">Sign in to Pivotroom.africa</h1>
        <GoogleButton next={next} />
        <div className="flex items-center gap-3 text-xs text-pivot-muted">
          <div className="h-px flex-1 bg-pivot-line" />
          or
          <div className="h-px flex-1 bg-pivot-line" />
        </div>
        <LoginForm next={next} />
        <p className="text-sm text-pivot-ink-2">
          <Link href="/forgot-password" className="underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-sm text-pivot-ink-2">
          No account?{" "}
          <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
