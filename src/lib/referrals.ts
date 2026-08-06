import { useEffect, useState } from "react";
import { lessons } from "@/lib/lessons";

const KEY = "dh-referrals-v1";

/** Lesson numbers (1-based) after which a referral gate appears. */
export const GATE_AFTER = [5, 9, 14];

/** Referrals required per gate. */
export const PER_GATE = 2;

function read(): number {
  if (typeof window === "undefined") return 0;
  const raw = Number(localStorage.getItem(KEY));
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

/** Counts one referral — fired when a result card is shared or downloaded. */
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

export function useReferrals() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(read());
    sync();
    window.addEventListener("dh-referrals", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("dh-referrals", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return count;
}

/**
 * How many referrals are needed in total before the lesson at `index`
 * (0-based) can be opened.
 */
export function requiredFor(index: number) {
  return GATE_AFTER.filter((n) => index + 1 > n).length * PER_GATE;
}

/** The gate that blocks this lesson, if any. */
export function gateFor(index: number) {
  const required = requiredFor(index);
  if (required === 0) return null;
  const after = GATE_AFTER.filter((n) => index + 1 > n).slice(-1)[0]!;
  return { after, required };
}

export function isLocked(index: number, referrals: number) {
  return referrals < requiredFor(index);
}

/** Lessons that are currently reachable. */
export function unlockedCount(referrals: number) {
  return lessons.filter((_, i) => !isLocked(i, referrals)).length;
}
