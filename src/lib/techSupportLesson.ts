import type { Lesson } from "./lessons";

export const techSupportSources = [
  { org: "FTC", title: "How To Spot, Avoid, and Report Tech Support Scams", url: "https://consumer.ftc.gov/articles/how-spot-avoid-and-report-tech-support-scams", note: "Pop-ups, unexpected calls, refund scams and recovery steps." },
  { org: "CISA, NSA and partners", title: "Guide to Securing Remote Access Software (June 6, 2023)", url: "https://www.cisa.gov/sites/default/files/2023-06/Guide%20to%20Securing%20Remote%20Access%20Software_clean%20Final_508c.pdf", note: "Legitimate remote access tools can be abused by malicious actors." },
  { org: "FBI", title: "FaceStealer advisory (November 12, 2026)", url: "https://www.ic3.gov/CSA/2026/261112.pdf", note: "Fake video meetings replayed webcam footage and used technical errors to lure targets into installing malware." },
];

export const techSupportDecision = {
  scenario: "A warning pops up saying your computer is infected. You call the number on screen. The person says they’re from tech support and asks you to share your screen so they can “fix it.” What do you do next?",
  answer: "End the call.",
  explanation: "If you still need help, contact support yourself through a route you already trust. Use your device maker’s official app or website, or your workplace’s known help-desk directory. Don’t use the pop-up’s number, a link the caller sends, or a sponsored search result to verify them.",
};

export const techSupportResponses = [
  { id: "contact", label: "Saw the warning or spoke to the caller, but gave no access or information", urgency: "No emergency", firstAction: "End contact. Close the page.", body: "If you still need help, start a separate support request through the official channel." },
  { id: "view", label: "Shared your screen but didn’t grant control", urgency: "Stop sharing", firstAction: "Stop sharing.", body: "Think about what was visible. If a password or sign-in code was exposed, secure the affected account through the real service. If banking information was exposed, contact the bank through its official app or a known number." },
  { id: "control", label: "Granted control or ran software they supplied", urgency: "Act now", firstAction: "End the session and disconnect the device from the internet.", body: "Use a separate trusted device to contact workplace IT or qualified support and secure affected accounts. Don’t sign in or change passwords on the suspected device. Ending the session alone doesn’t remove anything that may have been installed." },
  { id: "payment", label: "Paid them or let them access your bank account", urgency: "Contact the bank or payment provider now", firstAction: "Contact the bank or payment provider now.", body: "Use a separate trusted device if remote access was granted. Ask whether the payment can be stopped or reversed. Save the receipt or transaction details, and don’t pay anyone who contacts you promising to recover the money." },
];

export const techSupportLesson: Lesson = {
  id: "fake-tech-support",
  title: "Fake Tech Support: Before You Share Your Screen or Give Control",
  emoji: "🖥️",
  tagline: "A real support tool doesn’t prove the person asking to use it is real.",
  intro: techSupportDecision.scenario,
  sections: [
    { heading: "The story changes; the safe response stays the same", body: "The same scam can start with an unexpected call from “IT” or a fake renewal notice that promises a refund. End the contact and verify independently before sharing information or access.", tips: [] },
    { heading: "Viewing is different from control", body: "Screen sharing can let someone see what’s on your screen. That might include email, account balances, private documents or codes that appear in notifications.", tips: ["Remote control can let someone click and type on your device. Depending on permissions, they may also be able to open files, change settings or install software.", "Verified support may legitimately use these tools. For a support session you initiated and verified, ask what access is needed, keep sensitive windows closed, and end the session when the work is done.", "Don’t open your banking app or display passwords or sign-in codes during support."] },
    { heading: "Case note: a familiar face isn’t proof", body: "A familiar face in a video meeting isn’t proof of who is making the request. The FBI’s November 12, 2026 FaceStealer advisory documented fake meetings that replayed real webcam footage and used a supposed technical problem to persuade people to install a harmful “fix.”", tips: [] },
  ],
  sources: techSupportSources,
  quiz: [
    { q: "A pop-up gives you a support number. What’s your safest next step?", options: ["Call the number", "Close the pop-up and contact support independently if needed", "Reply to the warning"], answer: 1, explain: "The warning and the callback number came from the same unverified source." },
    { q: "Which permission lets someone click and type on your device?", options: ["Screen sharing alone", "Remote control", "Turning on your camera"], answer: 1, explain: "Viewing can expose information; control can also let someone take actions." },
    { q: "You gave unexpected “support” control of your laptop. What comes first?", options: ["Change your passwords on that laptop", "Wait to see if anything happens", "End the session, disconnect the laptop and get help using another device"], answer: 2, explain: "Don’t use a potentially compromised device to secure your accounts." },
  ],
};