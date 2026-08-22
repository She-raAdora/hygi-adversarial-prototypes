/**
 * First-touch traffic attribution (device-local, anonymous).
 *
 * Records the referring domain, UTM source, and landing path the very first
 * time a visitor arrives, so later lesson activity (onboarding starts, quiz
 * completions) can be attributed back to the link that brought them. Nothing
 * identifying is stored and nothing is sent until analytics consent is given.
 */

const KEY = "hygi-attribution-v1";

export type Attribution = {
  /** Referring domain, "direct", or a UTM-derived source. */
  referrerDomain: string;
  utmSource: string | null;
  landingPath: string;
  firstSeen: string;
};

function normalizeHost(host: string) {
  return host.toLowerCase().replace(/^www\./, "");
}

function readStored(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    if (!parsed || typeof parsed.referrerDomain !== "string") return null;
    return {
      referrerDomain: parsed.referrerDomain,
      utmSource: typeof parsed.utmSource === "string" ? parsed.utmSource : null,
      landingPath: typeof parsed.landingPath === "string" ? parsed.landingPath : "/",
      firstSeen: typeof parsed.firstSeen === "string" ? parsed.firstSeen : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Capture first-touch attribution once per device. Safe to call on every load. */
export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;

  const existing = readStored();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");

  let referrerDomain = "direct";
  const referrer = document.referrer;
  if (referrer) {
    try {
      const host = normalizeHost(new URL(referrer).hostname);
      if (host && host !== normalizeHost(window.location.hostname)) referrerDomain = host;
    } catch {
      /* unparsable referrer — treat as direct */
    }
  }
  if (referrerDomain === "direct" && utmSource) referrerDomain = normalizeHost(utmSource);

  const attribution: Attribution = {
    referrerDomain,
    utmSource: utmSource ? utmSource.toLowerCase() : null,
    landingPath: window.location.pathname,
    firstSeen: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(KEY, JSON.stringify(attribution));
  } catch {
    /* storage unavailable — attribution stays in-memory for this load */
  }
  return attribution;
}

/** The stored first-touch attribution, capturing it if this is the first load. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  return readStored() ?? captureAttribution();
}
