import { describe, expect, it } from "vitest";
import { unexpectedMfaScenario } from "./unexpectedMfaScenario";
import { getLesson, lessons } from "./lessons";

describe("unexpected MFA approval practice", () => {
  it("rejects approving or taking a number from the caller", () => {
    expect(unexpectedMfaScenario.question.answer).toBe(2);
    expect(unexpectedMfaScenario.question.answer).not.toBe(0);
    expect(unexpectedMfaScenario.question.answer).not.toBe(1);
  });
  it("preserves the existing account lesson and four-point badge", () => {
    expect(lessons).toHaveLength(38);
    expect(lessons.filter((lesson) => lesson.id === "shield-accounts")).toHaveLength(1);
    expect(getLesson("shield-accounts")?.quiz.map((question) => question.answer)).toEqual([1, 1, 1, 1]);
    expect(getLesson("shield-accounts")?.sections).toHaveLength(3);
  });
});