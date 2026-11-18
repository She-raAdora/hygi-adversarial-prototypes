import { describe, expect, it } from "vitest";
import { lessons, getLesson } from "./lessons";
import { pathwayOf } from "./pathways";

describe("fake tech-support lesson integration", () => {
  it("adds one lesson while preserving the existing final lesson positions", () => {
    expect(lessons.filter((lesson) => lesson.id === "fake-tech-support")).toHaveLength(1);
    expect(lessons.slice(35).map((lesson) => lesson.id)).toEqual(["sim-swap", "smishing", "fake-tech-support"]);
  });
  it("belongs to Social Engineering Defense", () => {
    expect(pathwayOf("fake-tech-support")?.id).toBe("scams");
  });
  it("uses the three supplied safety decisions for the badge", () => {
    const quiz = getLesson("fake-tech-support")?.quiz;
    expect(quiz).toHaveLength(3);
    expect(quiz?.map((question) => question.options[question.answer])).toEqual([
      "Close the pop-up and contact support independently if needed",
      "Remote control",
      "End the session, disconnect the laptop and get help using another device",
    ]);
  });
});