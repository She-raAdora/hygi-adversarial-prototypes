import type { QuizQ } from "./lessons";

export const consentPhishingScenario = {
  title: "The sign-in page is real. Should I allow access?",
  setup: "A message from someone you recognize says they shared a document. The link opens what looks like your usual account sign-in. After you sign in, a permission screen asks you to let an app you don’t recognize read your email. You only expected to view a document.",
  question: {
    q: "What should you do?",
    options: [
      "A. Choose Allow because the account provider’s sign-in page is real.",
      "B. Choose Cancel, then contact the sender through a channel you already trust and ask them to share the file through your usual service.",
      "C. Choose Allow because you can always remove access later.",
    ],
    answer: 1,
    explain: "A real provider can display a real permission request for an app you shouldn’t trust. Signing in proves who you are; choosing Allow grants the app access. Reading your email is more access than you expected for viewing one document. Stop if you don’t recognize the app or its permissions don’t match the task.",
  } satisfies QuizQ,
  comparison: [
    { title: "Device-code phishing", body: "You’re tricked into authorizing a sign-in on someone else’s device." },
    { title: "Consent phishing", body: "You’re tricked into giving an app permission to use part of your account." },
  ],
  recovery: "Open the account provider’s official app or website independently. Look for Connected apps, Third-party access, or a similar setting. Remove the unfamiliar app’s access. Don’t rely on a password change alone to remove an app permission. If it’s a work or school account, report it promptly through your known IT help desk. Removing access doesn’t retrieve data the app may already have copied.",
  source: {
    org: "FBI / Internet Crime Complaint Center",
    title: "Malicious Cyber Actors Gain Access to Victim Accounts Through Consent Phishing",
    url: "https://www.ic3.gov/PSA/2026/PSA260901",
    note: "September 1, 2026 advisory documenting consent phishing through genuine permission requests and access that a password change alone does not revoke. The practice example is fictional.",
  },
};