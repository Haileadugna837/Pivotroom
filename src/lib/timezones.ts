// Curated, not exhaustive — every IANA zone that actually matters for an
// Africa-focused marketplace, plus the handful of non-African zones an
// expert or client might realistically be in. Using a fixed list (not a
// free-text field) so we never store a value date-fns-tz/Intl can't parse.
export const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: "Africa/Addis_Ababa", label: "East Africa Time (Addis Ababa, Nairobi) — UTC+3" },
  { value: "Africa/Cairo", label: "Cairo — UTC+2" },
  { value: "Africa/Lagos", label: "West Africa Time (Lagos, Accra) — UTC+1" },
  { value: "Africa/Johannesburg", label: "South Africa Time (Johannesburg) — UTC+2" },
  { value: "Africa/Casablanca", label: "Casablanca — UTC+1" },
  { value: "Africa/Khartoum", label: "Khartoum — UTC+2" },
  { value: "Africa/Kampala", label: "Kampala — UTC+3" },
  { value: "Africa/Dar_es_Salaam", label: "Dar es Salaam — UTC+3" },
  { value: "Europe/London", label: "London — UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris, Berlin — UTC+1/+2" },
  { value: "America/New_York", label: "US Eastern — UTC-5/-4" },
  { value: "America/Los_Angeles", label: "US Pacific — UTC-8/-7" },
  { value: "Asia/Dubai", label: "Dubai — UTC+4" },
  { value: "Asia/Kolkata", label: "India — UTC+5:30" },
  { value: "UTC", label: "UTC" },
];

export const DEFAULT_TIMEZONE = "Africa/Addis_Ababa";
