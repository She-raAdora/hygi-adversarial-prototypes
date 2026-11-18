import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unexpectedMfaScenario as scenario } from "@/lib/unexpectedMfaScenario";

export function UnexpectedMfaScenario() {
  const [picked, setPicked] = useState<number | null>(null);
  const [showNext, setShowNext] = useState(false);
  const retryRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const question = scenario.question;

  useEffect(() => {
    if (picked !== null) retryRef.current?.focus();
  }, [picked]);

  return <section aria-labelledby="unexpected-mfa-title" className="mb-8 border-b border-border pb-8">
    <h2 id="unexpected-mfa-title" className="text-xl font-semibold">{scenario.title}</h2>
    <p className="mt-3 text-muted-foreground">{scenario.setup}</p>
    <fieldset className="mt-5 border-0 p-0" disabled={picked !== null}>
      <legend className="font-medium">{question.q}</legend>
      <div className="mt-3 space-y-2">
        {question.options.map((option, index) => {
          const correct = picked !== null && index === question.answer;
          const wrong = picked === index && !correct;
          return <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:disabled]:cursor-default ${correct ? "border-success/60 bg-success/10" : wrong ? "border-destructive/60 bg-destructive/10" : "border-border bg-card"}`}>
            <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name="unexpected-mfa-decision" value={index} checked={picked === index} onChange={() => setPicked(index)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            <span className="min-w-0 flex-1">{option}</span>
            {correct ? <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-success-strong" /> : wrong ? <X aria-hidden="true" className="h-4 w-4 shrink-0 text-destructive-strong" /> : null}
          </label>;
        })}
      </div>
    </fieldset>
    <div role="status" aria-live="polite" className="mt-4">
      {picked !== null ? <div className={`rounded-lg border p-4 text-sm ${picked === question.answer ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
        <p className="font-medium">{picked === question.answer ? "Correct!" : "Not quite."}</p>
        <p className="mt-2 text-muted-foreground">{question.explain}</p>
      </div> : null}
    </div>
    {picked !== null ? <Button ref={retryRef} variant="outline" className="mt-3" onClick={() => {
      setPicked(null);
      requestAnimationFrame(() => firstOptionRef.current?.focus());
    }}><RotateCcw aria-hidden="true" /> Try again</Button> : null}
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