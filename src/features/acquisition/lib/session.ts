export function getDeviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

const STORAGE_KEY = "pivotroom_acquisition_session_id";

export function getOrCreateAcquisitionSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}
