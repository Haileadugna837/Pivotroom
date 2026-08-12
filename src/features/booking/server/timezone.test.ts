import { describe, expect, it } from "vitest";
import { zonedWallTimeToUtc } from "./timezone";

describe("zonedWallTimeToUtc", () => {
  it("converts an expert's local wall-clock time to the correct UTC instant", () => {
    // 14:30 in Addis Ababa (UTC+3) is 11:30 UTC.
    const result = zonedWallTimeToUtc("2026-08-15", "14:30:00", "Africa/Addis_Ababa");
    expect(result.toISOString()).toBe("2026-08-15T11:30:00.000Z");
  });

  it("treats UTC as a no-op", () => {
    const result = zonedWallTimeToUtc("2026-08-15", "09:00:00", "UTC");
    expect(result.toISOString()).toBe("2026-08-15T09:00:00.000Z");
  });

  it("handles a negative-offset timezone", () => {
    // 09:00 in New York during EDT (UTC-4) is 13:00 UTC.
    const result = zonedWallTimeToUtc("2026-08-15", "09:00:00", "America/New_York");
    expect(result.toISOString()).toBe("2026-08-15T13:00:00.000Z");
  });
});
