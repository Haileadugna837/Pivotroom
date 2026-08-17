"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

type IdentifiedUser = { id: string; email: string; isAdmin: boolean };

export function PostHogIdentify({ user }: { user: IdentifiedUser | null }) {
  // Depend on the primitive fields, not the `user` object itself — a fresh
  // object literal arrives as a prop on every server render even when
  // nothing about the signed-in user actually changed, which would
  // otherwise re-run this effect (and re-call identify()) on every
  // navigation instead of only on real sign-in/sign-out/admin transitions.
  useEffect(() => {
    if (!user) {
      posthog.reset();
      return;
    }
    if (user.isAdmin) {
      // Keep admin's own testing/admin usage out of real user analytics
      // entirely, rather than just filtering it out later in PostHog's UI.
      posthog.opt_out_capturing();
      return;
    }
    posthog.opt_in_capturing();
    posthog.identify(user.id, { email: user.email });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.email, user?.isAdmin]);

  return null;
}
