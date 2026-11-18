import { useEffect, useRef, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQ } from "@/lib/lessons";

/** In-lesson quiz controls and feedback; answers are temporary and never saved. */
export function PracticeQuestion({ question, name }: { question: QuizQ; name: string }) {
  const [picked, setPicked] = useState<number | null>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (picked !== null) retryRef.current?.focus();
  }, [picked]);

  return <>
    <fieldset className="mt-5 border-0 p-0" disabled={picked !== null}>
      <legend className="font-medium">{question.q}</legend>
      <div className="mt-3 space-y-2">
        {question.options.map((option, index) => {
          const correct = picked !== null && index === question.answer;
          const wrong = picked === index && !correct;
          return <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:disabled]:cursor-default ${correct ? "border-success/60 bg-success/10" : wrong ? "border-destructive/60 bg-destructive/10" : "border-border bg-card"}`}>
            <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name={name} value={index} checked={picked === index} onChange={() => setPicked(index)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
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
  </>;
}