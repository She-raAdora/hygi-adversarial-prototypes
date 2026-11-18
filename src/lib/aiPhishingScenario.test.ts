import { describe, expect, it } from "vitest";
import { aiPhishingScenarioQuestion, upgradeLegacyScores } from "./aiPhishingScenario";
import { lessons } from "./lessons";

describe("AI phishing scenario", () => {
  it("correct answer is checking through the official app or bookmark", () => {
    expect(aiPhishingScenarioQuestion.answer).toBe(2);
  });
  it("is the fourth quiz question", () => {
    const l = lessons.find((x) => x.id === "ai-phishing")!;
    expect(l.quiz.length).toBe(4);
  });
  it("keeps a perfect old 3/3 score as the badge", () => {
    expect(upgradeLegacyScores({ "ai-phishing": 3 })["ai-phishing"]).toBe(4);
    expect(upgradeLegacyScores({ "ai-phishing": 2 })["ai-phishing"]).toBe(2);
  });
});
