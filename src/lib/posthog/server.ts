import "server-only";
import { PostHog } from "posthog-node";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return null;
  if (!client) {
    client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Flush every event immediately instead of batching — this runs in
      // short-lived Vercel functions that can terminate before a batched
      // flush would otherwise fire.
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}

// Captures a business event for the person it happened *to* — the client
// or expert whose booking/application/status changed — not necessarily the
// person who triggered the request (e.g. an admin approving an expert).
// Always await this before a Server Action returns or redirects, for the
// same immediate-flush-vs-serverless-termination reason above.
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
) {
  const ph = getClient();
  if (!ph) return;
  await ph.capture({ distinctId, event, properties });
}
