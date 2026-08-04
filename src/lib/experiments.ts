/**
 * Tiny client-side A/B testing.
 *
 * A visitor is assigned one variant per experiment on first visit and keeps it
 * for good (stored in localStorage), so the measurement isn't polluted by the
 * same person seeing different CTAs. Assignment is random and anonymous — no
 * identifier is created and nothing is sent anywhere without analytics consent.
 */

export type CtaPlacement = "below-copy" | "above-headline";

export type HomeCtaVariant = {
  id: string;
  /** Human label for the dashboard. */
  label: string;
  /** Primary CTA wording for a first-time visitor. */
  copy: string;
  /** Wording once the visitor has progress. */
  returningCopy: string;
  /** Where the primary CTA block renders in the hero. */
  placement: CtaPlacement;
};

export const HOME_CTA_EXPERIMENT = "home_cta_v1";

export const HOME_CTA_VARIANTS: HomeCtaVariant[] = [
  {
    id: "a",
    label: "A — Control (below copy)",
    copy: "Start your first lesson",
    returningCopy: "Continue learning",
    placement: "below-copy",
  },
  {
    id: "b",
    label: "B — Benefit wording (below copy)",
    copy: "Take your first 5-minute lesson",
    returningCopy: "Pick up where you left off",
    placement: "below-copy",
  },
  {
    id: "c",
    label: "C — Above the headline",
    copy: "Start learning free",
    returningCopy: "Continue learning",
    placement: "above-headline",
  },
];

const STORAGE_PREFIX = "hygi-experiment-";
const OVERRIDE_PARAM = "hygi_variant";

function readStored(experiment: string): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + experiment);
  } catch {
    return null;
  }
}

function store(experiment: string, variantId: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + experiment, variantId);
  } catch {
    /* private mode — the visitor just gets a fresh draw next time */
  }
}

/** Lets us force a variant via ?hygi_variant=c when reviewing a build. */
function readOverride(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get(OVERRIDE_PARAM);
  return value && HOME_CTA_VARIANTS.some((v) => v.id === value) ? value : null;
}

/**
 * Returns the visitor's assigned variant id, assigning one if needed.
 * Returns the control id during SSR so the first paint is deterministic.
 */
export function assignVariant(experiment: string, variantIds: string[]): string {
  const control = variantIds[0] as string;
  if (typeof window === "undefined") return control;

  const override = readOverride();
  if (override) {
    store(experiment, override);
    return override;
  }

  const existing = readStored(experiment);
  if (existing && variantIds.includes(existing)) return existing;

  const picked = variantIds[Math.floor(Math.random() * variantIds.length)] ?? control;
  store(experiment, picked);
  return picked;
}

export function getHomeCtaVariantId(): string {
  return assignVariant(
    HOME_CTA_EXPERIMENT,
    HOME_CTA_VARIANTS.map((v) => v.id),
  );
}

export function homeCtaVariant(id: string): HomeCtaVariant {
  return HOME_CTA_VARIANTS.find((v) => v.id === id) ?? (HOME_CTA_VARIANTS[0] as HomeCtaVariant);
}

/** Variant labels keyed by id, for rendering results tables. */
export function homeCtaVariantLabels(): Record<string, string> {
  return Object.fromEntries(HOME_CTA_VARIANTS.map((v) => [v.id, v.label]));
}
