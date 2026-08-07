const KEY = "dh-referrals-v1";

function read(): number {
  if (typeof window === "undefined") return 0;
  const raw = Number(localStorage.getItem(KEY));
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

/** Counts one share — fired when a result card is shared or downloaded. */
export function recordReferral() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, String(read() + 1));
  window.dispatchEvent(new Event("dh-referrals"));
}

export function resetReferrals() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("dh-referrals"));
}
