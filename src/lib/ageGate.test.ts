import { describe, expect, it } from "vitest";
import { isUnderMinAge } from "./ageGate";

const now = new Date(2026, 10, 1); // Nov 1, 2026

describe("isUnderMinAge", () => {
  it("blocks a 12-year-old", () => {
    expect(isUnderMinAge(2014, 6, now)).toBe(true);
  });
  it("allows someone who turned 13 last month", () => {
    expect(isUnderMinAge(2013, 10, now)).toBe(false);
  });
  it("blocks someone turning 13 this month (safer side)", () => {
    expect(isUnderMinAge(2013, 11, now)).toBe(true);
  });
  it("allows an adult", () => {
    expect(isUnderMinAge(1990, 1, now)).toBe(false);
  });
});
