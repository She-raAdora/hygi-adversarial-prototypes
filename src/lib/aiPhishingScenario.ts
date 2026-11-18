import type { QuizQ } from "./lessons";

/** Browser-safe scenario question for the Spot AI-Powered Phishing quiz. */
export const aiPhishingScenarioQuestion: QuizQ = {
  q: "Both messages look real. What would you do?",
  scenario: {
    setup:
      "You get two polished messages about your email account. Both claim there was an unfamiliar sign-in. One offers a button to review it; the other offers a button to confirm whether it was you. You weren’t expecting either message.",
    messages: [
      {
        label: "Message A",
        text: "We noticed a new sign-in to your email account. If it wasn’t you, select ‘Review sign-in’ to check the details.",
        button: "Review sign-in",
      },
      {
        label: "Message B",
        text: "Your email account was accessed from a new device. Select ‘Confirm activity’ to tell us whether this sign-in was yours.",
        button: "Confirm activity",
      },
    ],
    prompt: "What’s the safest next step for either message?",
    takeaway: "Verify the request, not the writing style.",
  },
  options: [
    "Use the button in the message that sounds more professional.",
    "Reply to both messages and ask the sender to prove who they are.",
    "Open your email provider’s official app or a saved bookmark yourself, then check recent sign-in activity.",
  ],
  answer: 2,
  explain:
    "In this practice scenario, one alert is genuine and one is an imitation. You don’t need to know which is which. Checking through the service directly lets you respond to a real alert without trusting the link in a fake one. Clear writing and familiar branding don’t prove who sent a message, and you don’t have to guess whether AI wrote it.",
};

/** Quiz lengths before a question was added; a perfect old score still counts as the badge. */
export const LEGACY_QUIZ_UPGRADES: Record<string, { from: number; to: number }> = {
  "ai-phishing": { from: 3, to: 4 },
};

export function upgradeLegacyScores(data: Record<string, number>): Record<string, number> {
  const out = { ...data };
  for (const [id, { from, to }] of Object.entries(LEGACY_QUIZ_UPGRADES)) {
    if (out[id] === from) out[id] = to;
  }
  return out;
}
