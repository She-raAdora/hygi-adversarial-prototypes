import { describe, expect, it } from "vitest";
import { aiAgencyPractice } from "./aiAgencyPractice";
import { getLesson, lessons } from "./lessons";

describe("AI agency practice", () => {
  it("requires B: limited details and review before a specific send", () => {
    expect(aiAgencyPractice.question.answer).toBe(1);
    expect(aiAgencyPractice.question.options).toHaveLength(3);
  });
  it("preserves the existing lesson and four-question badge requirements", () => {
    expect(lessons.filter((lesson) => lesson.id === "ai-agents-guardrails")).toHaveLength(1);
    expect(getLesson("ai-agents-guardrails")?.quiz.map((question) => question.answer)).toEqual([2, 1, 2, 1]);
    expect(getLesson("ai-agents-guardrails")?.sections).toHaveLength(4);
  });
});