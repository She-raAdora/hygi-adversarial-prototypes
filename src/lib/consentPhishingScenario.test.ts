import { describe, expect, it } from "vitest";
import { consentPhishingScenario } from "./consentPhishingScenario";
import { getLesson, lessons } from "./lessons";

describe("consent phishing practice", () => {
  it("requires B, not either Allow option", () => {
    expect(consentPhishingScenario.question.answer).toBe(1);
  });
  it("preserves the existing device-code lesson and badge requirements", () => {
    expect(lessons.filter((lesson) => lesson.id === "device-code-phishing")).toHaveLength(1);
    expect(getLesson("device-code-phishing")?.quiz.map((question) => question.answer)).toEqual([1, 1, 2, 1]);
    expect(getLesson("device-code-phishing")?.sections).toHaveLength(4);
  });
});