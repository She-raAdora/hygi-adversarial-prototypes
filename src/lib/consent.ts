/**
 * Analytics consent, stored per device.
 *
 * Google Analytics only loads after an explicit opt-in, which keeps the app
 * clear of App Store tracking-consent problems. The device-local event log used
 * by the Insights dashboard never leaves the device and is unaffected.
 */

const KEY = "hygi-analytics-consent";

export type ConsentState = "granted" | "denied" | "unset";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(state: Exclude<ConsentState, "unset">) {
  try {
    localStorage.setItem(KEY, state);
  } catch {
    /* storage unavailable — treat as denied for this session */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hygi-consent-change", { detail: state }));
  }
}

export function hasAnalyticsConsent() {
  return readConsent() === "granted";
}

export function onConsentChange(listener: (state: ConsentState) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener(readConsent());
  window.addEventListener("hygi-consent-change", handler);
  return () => window.removeEventListener("hygi-consent-change", handler);
}
