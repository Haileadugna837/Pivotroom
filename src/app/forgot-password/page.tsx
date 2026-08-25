import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center bg-pivot-paper px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-pivot-ink">Reset your password</h1>
          <p className="mt-1 text-sm text-pivot-muted">
            Enter the email on your account and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="text-sm text-pivot-ink-2">
          <Link href="/login" className="underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
