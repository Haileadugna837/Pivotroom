import { describe, expect, it } from "vitest";
import { isStillBlocking, PENDING_PAYMENT_TTL_MINUTES } from "./availability-rules";

const NOW = new Date("2026-08-12T12:00:00.000Z").getTime();

describe("isStillBlocking", () => {
  it("blocks a fresh pending_payment booking", () => {
    const booking = { status: "pending_payment", created_at: new Date(NOW - 5 * 60_000).toISOString() };
    expect(isStillBlocking(booking, NOW)).toBe(true);
  });

  it("stops blocking once a pending_payment booking is past the TTL", () => {
    const booking = {
      status: "pending_payment",
      created_at: new Date(NOW - (PENDING_PAYMENT_TTL_MINUTES + 1) * 60_000).toISOString(),
    };
    expect(isStillBlocking(booking, NOW)).toBe(false);
  });

  it("still blocks right at the TTL boundary", () => {
    const booking = {
      status: "pending_payment",
      created_at: new Date(NOW - PENDING_PAYMENT_TTL_MINUTES * 60_000 + 1).toISOString(),
    };
    expect(isStillBlocking(booking, NOW)).toBe(true);
  });

  it("always blocks payment_submitted regardless of age", () => {
    const booking = {
      status: "payment_submitted",
      created_at: new Date(NOW - 10 * 24 * 60 * 60_000).toISOString(),
    };
    expect(isStillBlocking(booking, NOW)).toBe(true);
  });

  it("always blocks confirmed regardless of age", () => {
    const booking = { status: "confirmed", created_at: new Date(NOW - 10 * 24 * 60 * 60_000).toISOString() };
    expect(isStillBlocking(booking, NOW)).toBe(true);
  });
});
