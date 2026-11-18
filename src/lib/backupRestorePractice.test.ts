import { describe, expect, it } from "vitest";
import { getLesson, lessons } from "./lessons";

describe("optional one-file recovery practice", () => {
  it("preserves the existing backup lesson's three-point badge quiz", () => {
    expect(lessons.filter((lesson) => lesson.id === "encrypt-backup")).toHaveLength(1);
    expect(getLesson("encrypt-backup")?.quiz.map((question) => question.answer)).toEqual([1, 1, 1]);
  });
  it("leaves lesson completion independent of the optional drill", () => {
    expect(getLesson("encrypt-backup")?.sections).toHaveLength(2);
    expect(lessons).toHaveLength(38);
  });
});