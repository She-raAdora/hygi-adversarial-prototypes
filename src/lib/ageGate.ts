/** Minimum age to create a Hygi account (U.S. COPPA threshold). */
export const MIN_ACCOUNT_AGE = 13;
export const AGE_STORAGE_KEY = "hygi-age-check";

/**
 * True when someone born in the given year and month (1-12) is under 13 today.
 * Without a birth day, the month is treated as their birthday month not yet
 * reached, so anyone turning 13 this month is still treated as 12 (the safer side).
 */
export function isUnderMinAge(birthYear: number, birthMonth: number, now: Date = new Date()): boolean {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let age = year - birthYear;
  if (month <= birthMonth) age -= 1;
  return age < MIN_ACCOUNT_AGE;
}
