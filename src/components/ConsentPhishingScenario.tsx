import { Link } from "@tanstack/react-router";
import { PracticeQuestion } from "@/components/PracticeQuestion";
import { consentPhishingScenario as scenario } from "@/lib/consentPhishingScenario";

export function ConsentPhishingScenario() {
  return <section id="consent-phishing" aria-labelledby="consent-phishing-title" className="scroll-mt-24 border-b border-border pb-8">
    <h2 id="consent-phishing-title" className="text-xl font-semibold">{scenario.title}</h2>
    <p className="mt-3 text-muted-foreground">{scenario.setup}</p>
    <PracticeQuestion question={scenario.question} name="consent-phishing-decision" />
    <ul className="mt-5 space-y-3 text-sm">
      {scenario.comparison.map((item) => <li key={item.title}><strong>{item.title}:</strong> {item.body}</li>)}
    </ul>
    <h3 className="mt-5 font-semibold">If you already chose Allow</h3>
    <p className="mt-2 text-sm text-muted-foreground">{scenario.recovery}</p>
    <Link to="/lesson/$id" params={{ id: "shield-accounts" }} hash="topic-sessions-devices-and-connected-apps" className="mt-3 inline-block text-sm text-primary underline underline-offset-4">Lock Down Account Access: reviewing connected apps</Link>
    <a href={scenario.source.url} target="_blank" rel="noopener noreferrer" className="mt-4 block text-sm text-primary underline underline-offset-4">{scenario.source.org}: {scenario.source.title} (September 1, 2026)<span className="sr-only"> (opens in a new tab)</span></a>
  </section>;
}