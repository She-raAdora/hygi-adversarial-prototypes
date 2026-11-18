import type { Lesson } from "./lessons";

export const smishingSources = [
  { org: "FTC", title: "How to Recognize and Report Spam Text Messages", url: "https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages", note: "Independent verification and reporting texts as spam, including 7726." },
  { org: "FTC", title: "Is that unexpected text a scam?", url: "https://consumer.ftc.gov/consumer-alerts/2025/04/unexpected-text-scam", note: "Unexpected bank, delivery and toll messages." },
  { org: "FTC", title: "What To Do if You Were Scammed", url: "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed", note: "Next steps after payment, information exposure or device access." },
];

export const smishingResponses = [
  { id: "read", label: "I only received or read it", urgency: "No emergency", firstAction: "Don’t respond.", body: "Report it as junk or spam, then delete it. Reading an ordinary scam text alone usually doesn’t call for a password reset." },
  { id: "tap", label: "I tapped but didn’t enter, download, install or approve anything", urgency: "Close the page", firstAction: "Close the page.", body: "Don’t go back to investigate. A tap alone isn’t proof of compromise. If you see an unexpected download, don’t open it." },
  { id: "account", label: "I entered a password, shared a sign-in code or approved a login", urgency: "Secure the account now", firstAction: "Open the real service yourself.", body: "Change the exposed password and any reused copies, sign out other sessions, and check recovery settings. Use official account recovery or support if you can’t get in. For work accounts, notify IT promptly." },
  { id: "payment", label: "I paid or shared card or bank details", urgency: "Contact the bank or payment provider now", firstAction: "Contact the bank or payment provider now.", body: "Use its official app or a number you already trust. Ask whether the payment can be stopped or reversed and how to protect the account. Save transaction details and screenshots without reopening the suspicious link." },
  { id: "device", label: "I installed something or gave someone remote control", urgency: "Stop sensitive tasks on this device", firstAction: "Stop using that device for sensitive tasks.", body: "End the remote session, disconnect the device from the internet, and use another trusted device to contact official support or qualified help. Don’t change passwords on the suspected device." },
];

export const smishingLesson: Lesson = {
  id: "smishing",
  title: "Smishing: When a Scam Arrives by Text",
  emoji: "📩",
  tagline: "Verify the request outside the message. If you already acted, know what to do next.",
  intro: "Smishing means phishing by text message. A scam text might claim you owe a toll, missed a package delivery, or need to confirm a bank charge. It can look polished and arrive when you’re actually expecting a package. You don’t have to decide whether it’s fake before choosing a safer next step.",
  sections: [
    { heading: "Pause. Leave the text. Check through a channel you already trust.", body: "For a bank alert, open the banking app yourself or call the number on your card. For a delivery or toll notice, check the official app or website independently.", tips: ["Don’t reply, tap the message link, call its number, or share a verification code."] },
  ],
  sources: smishingSources,
  quiz: [
    { q: "A text says your bank blocked a purchase and asks you to call. What’s safest?", options: ["Call the number in the text", "Open your banking app yourself", "Reply to ask for proof"], answer: 1, explain: "You can check the charge without trusting the text’s contact details." },
    { q: "You read a fake delivery text but didn’t interact. What should you do?", options: ["Reset your phone", "Change every password", "Report it as junk and delete it"], answer: 2, explain: "Match your response to what happened. Reading an ordinary scam text isn’t, by itself, an emergency." },
    { q: "You entered your card details on a fake toll page. What comes first?", options: ["Contact your card issuer through its official app or the number on your card", "Wait for a charge", "Go back to the page to cancel"], answer: 0, explain: "The issuer can help protect the card. Don’t revisit the suspicious page." },
  ],
};