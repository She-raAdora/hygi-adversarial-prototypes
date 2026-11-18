import type { QuizQ } from "./lessons";

export const unexpectedDownloadScenario = {
  title: "I searched for a form. Why did I get a ZIP file?",
  setup: "You search for a county form. One of the first results looks helpful, but instead of opening the form, it downloads a ZIP file you weren’t expecting.",
  question: {
    q: "What should you do next?",
    options: ["Open it to see whether the form is inside.", "Leave it unopened and go directly to the county’s official website to find the form.", "Trust the download because the result ranked high and the page used HTTPS."],
    answer: 1,
    explain: "Search ranking isn’t a safety check. HTTPS protects the connection; it doesn’t prove the file is safe. An unexpected ZIP isn’t automatically malicious, but you don’t need to open it to find out. Check both the publisher and the kind of file you expected. A PDF extension alone doesn’t prove a file is safe either.",
  } satisfies QuizQ,
  takeaway: "Find the official publisher. Leave unexpected downloads unopened.",
  source: { org: "FBI", title: "Gootloader Malware Using SEO Poisoning and Compromised Websites to Gain Initial Access (November 16, 2026)", url: "https://www.ic3.gov/CSA/2026/261116.pdf" },
};