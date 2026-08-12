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
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-xl font-semibold">Set a new password</h1>
      {user ? (
        <ResetPasswordForm />
      ) : (
        <p className="text-sm text-black/60 dark:text-white/60">
          This link has expired or was already used.{" "}
          <Link href="/forgot-password" className="underline">
            Request a new one
          </Link>
          .
        </p>
      )}
    </div>
  );
}
