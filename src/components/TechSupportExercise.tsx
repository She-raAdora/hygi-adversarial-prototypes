import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { techSupportDecision, techSupportResponses, techSupportSources } from "@/lib/techSupportLesson";

function SourceLink({ index }: { index: number }) {
  const source = techSupportSources[index];
  if (!source) return null;
  return <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{source.org}: {source.title}<span className="sr-only"> (opens in a new tab)</span></a>;
}

export function TechSupportDecision() {
  const [revealed, setRevealed] = useState(false);
  return <section aria-label="Your next decision" className="space-y-4">
    <Button variant="outline" aria-expanded={revealed} aria-controls="tech-support-decision-answer" onClick={() => setRevealed((value) => !value)}>{revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}{revealed ? "Hide the answer" : "Reveal the safest next step"}</Button>
    <div id="tech-support-decision-answer" hidden={!revealed} className="space-y-2 border-l-2 border-primary pl-4">
      <p className="font-semibold">{techSupportDecision.answer}</p>
      <p className="text-muted-foreground">{techSupportDecision.explanation}</p>
      <p className="text-xs"><SourceLink index={0} /></p>
    </div>
  </section>;
}

export function TechSupportSectionSource({ index }: { index: number }) {
  return <div className="mt-4 space-y-3 text-sm"><SourceLink index={index === 1 ? 1 : index === 2 ? 2 : 0} />{index === 2 ? <p><Link to="/lesson/$id" params={{ id: "clickfix" }} className="text-primary underline underline-offset-4">Read the ClickFix lesson for more on fake fixes</Link>.</p> : null}</div>;
}

export function TechSupportRecovery() {
  return <section id="tech-support-recovery" aria-labelledby="tech-support-recovery-heading">
    <h2 id="tech-support-recovery-heading" className="text-xl font-semibold">What did you already do?</h2>
    <Accordion type="multiple" className="mt-3">
      {techSupportResponses.map((response) => <AccordionItem key={response.id} value={response.id} className="border-border">
        <AccordionTrigger className="gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"><span className="min-w-0"><span className="block">{response.label}</span><span className="mt-1 block text-xs font-semibold text-primary">{response.urgency}</span></span></AccordionTrigger>
        <AccordionContent className="space-y-2 leading-relaxed motion-reduce:animate-none"><p className="font-semibold">{response.firstAction}</p><p className="text-muted-foreground">{response.body}</p><p className="text-xs"><SourceLink index={0} /></p></AccordionContent>
      </AccordionItem>)}
    </Accordion>
    <div className="mt-6 space-y-3 text-sm text-muted-foreground"><h3 className="font-semibold text-foreground">U.S. reporting</h3><p className="font-medium text-foreground">Take immediate steps to protect money, accounts or devices first. Reporting does not secure them.</p><p>Then report the scam at <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">ReportFraud.ftc.gov<span className="sr-only"> (opens in a new tab)</span></a>.</p><p className="text-xs"><SourceLink index={0} /></p></div>
  </section>;
}