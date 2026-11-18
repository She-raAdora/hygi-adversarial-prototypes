import type { QuizQ } from "./lessons";

export const unexpectedMfaScenario = {
  title: "I didn’t try to sign in",
  setup: "Your phone keeps asking you to approve a sign-in to your email. You’re not signing in. Then someone claiming to be from IT tells you to approve the next request to stop the notifications.",
  question: {
    q: "What should you do?",
    options: [
      "Approve once so the notifications stop.",
      "Ask the caller what number to enter.",
      "Deny the request, end the conversation, and open your account independently to check recent activity.",
    ],
    answer: 2,
    explain: "Repeated approval requests can be an MFA fatigue attack: someone hopes you’ll tap Approve just to make the alerts stop. An unexpected prompt doesn’t prove someone got into your account, but it’s a reason to check. Never approve a sign-in you didn’t start or enter a number someone gives you.",
  } satisfies QuizQ,
  nextSteps: [
    { title: "You didn’t approve", body: "Deny or mark the prompt as suspicious if your app offers that option. Open the official app or a saved bookmark yourself and review recent sign-ins. If prompts repeat or you see unfamiliar activity, secure the account promptly. For a work or school account, report it through the known IT help desk." },
    { title: "You approved by mistake", body: "Act now. From a trusted device, open the real service, change the password if the account uses one, sign out other sessions, and check for unfamiliar recovery details or sign-in methods. If you’re locked out, use official account recovery. For work or school accounts, notify IT immediately." },
    { title: "For next time", body: "Use a passkey or security key where supported. If your organization uses push notifications, number matching is safer than a simple Approve button, but only enter a number shown on the sign-in screen you opened yourself. Number matching is not a substitute for phishing-resistant MFA." },
  ],
  comparison: "An approval prompt asks you to confirm a sign-in; a device-code scam asks you to enter a code to authorize someone else’s device. In both cases, stop if you didn’t start the sign-in.",
  source: { org: "CISA", title: "Implementing Number Matching in MFA Applications", url: "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implement-number-matching-in-mfa-applications-508c.pdf" },
};