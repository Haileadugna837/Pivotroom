import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

// Ethiopia is the primary market — used whenever a number doesn't already
// carry an explicit "+<country code>" prefix. Diaspora numbers with an
// explicit country code (e.g. "+1 415…") still parse correctly regardless
// of this default.
export const DEFAULT_PHONE_COUNTRY: CountryCode = "ET";

export type NormalizedPhone = {
  e164: string;
  formatted: string;
};

export function normalizePhone(
  raw: string,
  defaultCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): NormalizedPhone | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = parsePhoneNumberFromString(trimmed, defaultCountry);
  if (!parsed || !parsed.isValid()) return null;

  return { e164: parsed.number, formatted: parsed.formatInternational() };
}
