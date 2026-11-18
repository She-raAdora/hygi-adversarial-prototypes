import { describe, expect, it } from "vitest";
import { getLesson, lessons } from "./lessons";
import { pathwayOf } from "./pathways";

describe("smishing curriculum integration", () => {
  it("adds exactly one smishing lesson after the existing curriculum", () => {
    expect(lessons.filter((lesson) => lesson.id === "smishing")).toHaveLength(1);
    expect(lessons[35]?.id).toBe("sim-swap");
    expect(lessons[36]?.id).toBe("smishing");
  });
  it("belongs to Social Engineering Defense", () => {
    expect(pathwayOf("smishing")?.id).toBe("scams");
  });
  it("uses the three requested safety decisions for the existing badge score", () => {
    const quiz = getLesson("smishing")?.quiz;
    expect(quiz).toHaveLength(3);
    expect(quiz?.map((question) => question.options[question.answer])).toEqual([
      "Open your banking app yourself",
      "Report it as junk and delete it",
      "Contact your card issuer through its official app or the number on your card",
    ]);
  });
});