export type FunnelStepInput = { label: string; count: number };
export type FunnelStepResult = FunnelStepInput & { pctOfFirst: number; pctOfPrevious: number; dropOffPct: number };

// Pure — no DB access — so this is unit-testable without mocking Supabase.
// pctOfFirst/pctOfPrevious are both 100 for the first step (nothing to drop
// off from yet); dropOffPct is how much of the *previous* step's volume
// didn't make it to this one.
export function computeFunnelSteps(steps: FunnelStepInput[]): FunnelStepResult[] {
  const first = steps[0]?.count ?? 0;
  return steps.map((step, i) => {
    const previous = i === 0 ? step.count : steps[i - 1].count;
    const pctOfFirst = first > 0 ? Math.round((step.count / first) * 100) : 0;
    const pctOfPrevious = previous > 0 ? Math.round((step.count / previous) * 100) : 0;
    const dropOffPct = i === 0 || previous === 0 ? 0 : Math.max(0, 100 - pctOfPrevious);
    return { ...step, pctOfFirst, pctOfPrevious, dropOffPct };
  });
}

export type DemandGapSeverity = "High" | "Medium" | "Low";

// Thresholds calibrated against the spec's own worked example (Raising
// Capital 134 req / 2 experts -> High, Real Estate 64/5 -> Medium,
// Marketing 98/12 -> Low) rather than derived from any formal model —
// this is admin guidance for recruiting decisions, not an automated cutoff.
export function computeDemandGap(requests: number, existingExperts: number): DemandGapSeverity {
  if (requests === 0) return "Low";
  const ratio = requests / Math.max(existingExperts, 1);
  if (existingExperts === 0 || ratio >= 25) return "High";
  if (ratio >= 10) return "Medium";
  return "Low";
}
