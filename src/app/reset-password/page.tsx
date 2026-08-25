import Link from "next/link";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const user = await getUser();

  return (
    <div className="flex min-h-[70vh] flex-col justify-center bg-pivot-paper px-4">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-xl font-semibold text-pivot-ink">Set a new password</h1>
        {user ? (
          <ResetPasswordForm />
        ) : (
          <p className="text-sm text-pivot-ink-2">
            This link has expired or was already used.{" "}
            <Link href="/forgot-password" className="underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
