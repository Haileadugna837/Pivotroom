// Parses a textarea's newline-separated lines into a trimmed, non-empty,
// length-capped list — used for expert-editable bullet lists ("what to
// expect", "example questions") entered one item per line.
export function parseLines(value: string, max: number): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, max);
}
