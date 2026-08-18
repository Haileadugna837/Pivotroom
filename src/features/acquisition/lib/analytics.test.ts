import { describe, expect, it } from "vitest";
import { computeDemandGap, computeFunnelSteps } from "./analytics";

describe("computeFunnelSteps", () => {
  it("gives the first step 100% of itself and no drop-off", () => {
    const result = computeFunnelSteps([{ label: "Visitors", count: 200 }]);
    expect(result[0]).toMatchObject({ pctOfFirst: 100, pctOfPrevious: 100, dropOffPct: 0 });
  });

  it("computes percentage of first step and drop-off from the previous step", () => {
    const result = computeFunnelSteps([
      { label: "Visitors", count: 200 },
      { label: "Clicked CTA", count: 100 },
      { label: "Completed", count: 50 },
    ]);
    expect(result[1]).toMatchObject({ pctOfFirst: 50, pctOfPrevious: 50, dropOffPct: 50 });
    expect(result[2]).toMatchObject({ pctOfFirst: 25, pctOfPrevious: 50, dropOffPct: 50 });
  });

  it("handles a zero first step without dividing by zero", () => {
    const result = computeFunnelSteps([
      { label: "Visitors", count: 0 },
      { label: "Clicked CTA", count: 0 },
    ]);
    expect(result[0].pctOfFirst).toBe(0);
    expect(result[1].pctOfFirst).toBe(0);
    expect(result[1].dropOffPct).toBe(0);
  });

  it("returns an empty array for empty input", () => {
    expect(computeFunnelSteps([])).toEqual([]);
  });
});

describe("computeDemandGap", () => {
  it("matches the spec's worked examples", () => {
    expect(computeDemandGap(134, 2)).toBe("High");
    expect(computeDemandGap(74, 1)).toBe("High");
    expect(computeDemandGap(64, 5)).toBe("Medium");
    expect(computeDemandGap(98, 12)).toBe("Low");
  });

  it("treats zero existing experts with any demand as High", () => {
    expect(computeDemandGap(5, 0)).toBe("High");
  });

  it("treats zero requests as Low regardless of supply", () => {
    expect(computeDemandGap(0, 0)).toBe("Low");
  });
});
