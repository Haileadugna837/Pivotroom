import posthog from "posthog-js";

// Runs once in the browser before the app hydrates — the current
// recommended place to initialize a client-side analytics SDK for Next.js
// App Router, superseding the older "wrap the app in a Provider client
// component" pattern.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // App Router navigates via the history API, not full page reloads —
    // this captures those as pageviews instead of only the initial load.
    capture_pageview: "history_change",
    person_profiles: "identified_only",
  });
}
