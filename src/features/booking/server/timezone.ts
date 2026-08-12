import { fromZonedTime } from "date-fns-tz";

// Combines a plain date + wall-clock time (as entered by the expert, in
// their own declared timezone) into the correct absolute UTC Date. Without
// this, `new Date("2026-08-15T14:00:00")` gets parsed in whatever timezone
// the Node process happens to run in (UTC on Vercel), silently shifting
// every booking by however many hours the expert's real timezone differs
// from UTC.
export function zonedWallTimeToUtc(date: string, time: string, timezone: string): Date {
  return fromZonedTime(`${date}T${time}`, timezone);
}
