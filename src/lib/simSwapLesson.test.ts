import { describe, expect, it } from "vitest";
import { lessons, getLesson } from "./lessons";
import { pathwayOf } from "./pathways";
import { EXTRA_KEYS } from "./progressSync";

describe("SIM-swap lesson integration", () => {
  it("adds one lesson without duplicate identifiers", () => {
    expect(lessons.length).toBe(36);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(36);
    expect(getLesson("sim-swap")?.interactive).toBe("sim-swap");
  });
  it("belongs to the existing social engineering pathway", () => {
    expect(pathwayOf("sim-swap")?.id).toBe("scams");
  });
  it("uses the four supplied assessment answers", () => {
    expect(getLesson("sim-swap")?.quiz.map((question) => question.options[question.answer])).toEqual([
      "No", "Port-out protection", "FIDO passkey or security key", "Verify account status with your carrier using official contact information",
    ]);
  });
  it("syncs the optional review checkbox as learner progress", () => {
    expect(EXTRA_KEYS.includes("hygi-sim-swap-review-v1")).toBe(true);
  });
});