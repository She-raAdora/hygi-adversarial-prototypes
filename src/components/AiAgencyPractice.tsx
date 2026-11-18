import { PracticeQuestion } from "@/components/PracticeQuestion";
import { aiAgencyPractice as practice } from "@/lib/aiAgencyPractice";

export function AiAgencyPractice() {
  return <section id="ai-agency-practice" aria-labelledby="ai-agency-title" className="scroll-mt-24 border-b border-border pb-8">
    <h2 id="ai-agency-title" className="text-xl font-semibold">{practice.title}</h2>
    <p className="mt-2 text-sm text-muted-foreground">Hygi teaching example · Fictional practice</p>
    <p className="mt-3 text-muted-foreground">{practice.setup}</p>
    <PracticeQuestion question={practice.question} name="ai-agency-decision" />
    <fieldset className="mt-6 border-0 p-0">
      <legend className="font-semibold">Before I say yes</legend>
      <ul className="mt-3 space-y-3">
        {practice.checklist.map((item) => <li key={item.label}>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-ring" />
            <span><strong>{item.label}:</strong> {item.question}</span>
          </label>
        </li>)}
      </ul>
    </fieldset>
    <h3 className="mt-6 font-semibold">Three valid choices</h3>
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
      {practice.choices.map((choice) => <li key={choice}>{choice}</li>)}
    </ul>
    <p className="mt-4 text-sm text-muted-foreground">{practice.approval}</p>
    <p className="mt-3 text-sm text-muted-foreground">{practice.exit}</p>
    <p className="mt-5 font-medium">{practice.takeaway}</p>
    <p className="mt-5 text-sm text-muted-foreground">
      <a href={practice.source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{practice.source.org}: {practice.source.title}<span className="sr-only"> (opens in a new tab)</span></a>
      {" — "}{practice.source.note}
    </p>
  </section>;
}