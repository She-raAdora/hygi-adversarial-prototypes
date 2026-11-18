import { describe, expect, it } from "vitest";
import { unexpectedDownloadScenario } from "./unexpectedDownloadScenario";
import { getLesson, lessons } from "./lessons";

describe("unexpected download practice", () => {
  it("uses independent publisher verification rather than opening the ZIP", () => {
    const question = unexpectedDownloadScenario.question;
    expect(question.options[question.answer]).toBe("Leave it unopened and go directly to the county’s official website to find the form.");
  });
  it("preserves the existing lesson and five-answer badge threshold", () => {
    expect(lessons).toHaveLength(38);
    expect(getLesson("safe-browsing")?.quiz.map((question) => question.answer)).toEqual([1, 1, 0, 1, 1]);
    expect(lessons[0]?.id).toBe("safe-browsing");
  });
});