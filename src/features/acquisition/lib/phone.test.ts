import { describe, expect, it } from "vitest";
import { normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("normalizes a local Ethiopian number to E.164 using the default country", () => {
    const result = normalizePhone("0911234567");
    expect(result?.e164).toBe("+251911234567");
  });

  it("accepts an already-international number with an explicit country code", () => {
    const result = normalizePhone("+14155552671");
    expect(result?.e164).toBe("+14155552671");
  });

  it("tolerates spaces and dashes", () => {
    const result = normalizePhone("091 123 4567");
    expect(result?.e164).toBe("+251911234567");
  });

  it("returns null for an empty string", () => {
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("   ")).toBeNull();
  });

  it("returns null for an obviously invalid number", () => {
    expect(normalizePhone("123")).toBeNull();
  });
});
