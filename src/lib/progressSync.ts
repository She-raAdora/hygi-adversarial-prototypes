/**
 * Keeps on-device learning progress (badges, pathway assessment, certificate
 * names, Five-Door Reset checklist) in sync with the signed-in learner's
 * account. On sign-in, device and account progress are merged so nothing is lost.
 */
import type { Json } from "@/integrations/supabase/types";

export const BADGES_KEY = "dh-badges-v1";
/** Other on-device keys that belong to a learner's progress. */
export const EXTRA_KEYS = [
  "dh-social-engineering-assessment-v1",
  "dh-social-engineering-cert-name",
  "dh-cert-name",
  "hygi-five-door-v1",
] as const;

export type Badges = Record<string, number>;
export type Extras = Partial<Record<(typeof EXTRA_KEYS)[number], string>>;

/** Keep the best score for each lesson from either side. */
export function mergeBadges(a: Badges, b: Badges): Badges {
  const out: Badges = { ...a };
  for (const [id, score] of Object.entries(b)) {
    if (typeof score !== "number" || !Number.isFinite(score)) continue;
    out[id] = Math.max(out[id] ?? 0, score);
  }
  return out;
}

/** Device values win when present (they're newest); account fills the gaps. */
export function mergeExtras(device: Extras, account: Extras): Extras {
  const out: Extras = {};
  for (const key of EXTRA_KEYS) {
    const value = device[key] || account[key];
    if (value) out[key] = value;
  }
  return out;
}

export function readDevice(): { badges: Badges; extras: Extras } {
  let badges: Badges = {};
  try {
    badges = JSON.parse(localStorage.getItem(BADGES_KEY) || "{}") as Badges;
  } catch {
    badges = {};
  }
  const extras: Extras = {};
  for (const key of EXTRA_KEYS) {
    const v = localStorage.getItem(key);
    if (v) extras[key] = v;
  }
  return { badges, extras };
}

export function writeDevice(badges: Badges, extras: Extras) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  for (const key of EXTRA_KEYS) {
    const v = extras[key];
    if (v) localStorage.setItem(key, v);
  }
  window.dispatchEvent(new Event("dh-progress-synced"));
}

export function asJson(v: Badges | Extras): Json {
  return v as unknown as Json;
}
