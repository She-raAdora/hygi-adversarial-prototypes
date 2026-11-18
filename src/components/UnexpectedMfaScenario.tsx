import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PracticeQuestion } from "@/components/PracticeQuestion";
import { unexpectedMfaScenario as scenario } from "@/lib/unexpectedMfaScenario";

export function UnexpectedMfaScenario() {
  const [showNext, setShowNext] = useState(false);

  return <section aria-labelledby="unexpected-mfa-title" className="mb-8 border-b border-border pb-8">
    <h2 id="unexpected-mfa-title" className="text-xl font-semibold">{scenario.title}</h2>
    <p className="mt-3 text-muted-foreground">{scenario.setup}</p>
    <PracticeQuestion question={scenario.question} name="unexpected-mfa-decision" />
    <Button variant="outline" className="mt-5 flex max-w-full whitespace-normal text-left" aria-expanded={showNext} aria-controls="unexpected-mfa-next" onClick={() => setShowNext((value) => !value)}>
      <ChevronDown aria-hidden="true" className={showNext ? "rotate-180" : ""} /> Show what to do next
    </Button>
    <div id="unexpected-mfa-next" hidden={!showNext} className="mt-4 space-y-4 text-sm">
      {scenario.nextSteps.map((step) => <div key={step.title}>
        <h3 className="font-semibold">{step.title}</h3>
        <p className="mt-1 text-muted-foreground">{step.body}</p>
      </div>)}
    </div>
    <p className="mt-5 text-sm text-muted-foreground"><Link to="/lesson/$id" params={{ id: "device-code-phishing" }} className="text-primary underline underline-offset-4">Stop Device-Code Phishing</Link>: {scenario.comparison}</p>
    <a href={scenario.source.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-primary underline underline-offset-4">{scenario.source.org}: {scenario.source.title}<span className="sr-only"> (opens in a new tab)</span></a>
  </section>;
}