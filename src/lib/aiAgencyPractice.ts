import type { QuizQ } from "./lessons";

export const aiAgencyPractice = {
  title: "You’re Still in Charge: What Can AI Do for You?",
  setup: "You ask an AI agent to help schedule an appointment. It asks to read your entire inbox and contact the office for you. You only need help writing the message.",
  question: {
    q: "Which choice gives you useful help while keeping the decision in your hands?",
    options: [
      "A. Give it full inbox access and permission to send messages whenever needed.",
      "B. Give it only the details needed for a draft. Ask to see the recipient and exact message. Send it yourself, or approve that specific send only after reviewing it.",
      "C. Let it send the message now and check afterward.",
    ],
    answer: 1,
    explain: "Saying yes to help with a task isn’t the same as saying yes to every step. For this task, the agent doesn’t need your whole inbox. If the tool can’t enforce a draft-only or review-before-send boundary, don’t grant the access. You can still do the task yourself.",
  } satisfies QuizQ,
  checklist: [
    { label: "Action", question: "What exactly will it do?" },
    { label: "Data", question: "What will it read or share, and with whom?" },
    { label: "Approval", question: "Can I review, edit, or decline before anything is sent or changed?" },
    { label: "Exit", question: "How do I stop it or remove access? What can’t be undone afterward?" },
  ],
  choices: ["Draft only", "Approve this specific action after review", "Do it myself"],
  approval: "Approval is for this action, not ongoing permission. If the recipient, content, or information being shared changes, review it again.",
  exit: "Removing access can stop future actions; it won’t unsend a message or retrieve information already shared.",
  takeaway: "Let AI help you prepare the decision. You decide what happens next.",
  source: { org: "OECD", title: "AI Principles", url: "https://www.oecd.org/en/topics/sub-issues/ai-principles.html", note: "Human agency and oversight." },
};