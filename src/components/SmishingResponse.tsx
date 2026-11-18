import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { smishingResponses, smishingSources } from "@/lib/smishingLesson";

function SourceLink({ index }: { index: number }) {
  const source = smishingSources[index];
  if (!source) return null;
  return <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">FTC: {source.title}<span className="sr-only"> (opens in a new tab)</span></a>;
}

export function SmishingVerificationSources() {
  return <div className="mt-4 space-y-3 text-sm text-muted-foreground">
    <p><SourceLink index={0} /> · <SourceLink index={1} /></p>
    <p>For background: <Link to="/lesson/$id" params={{ id: "phishing-prevention-tactics" }} className="text-primary underline underline-offset-4">Stop Phishing Before You Click</Link> and <Link to="/lesson/$id" params={{ id: "dont-reply-to-spam" }} className="text-primary underline underline-offset-4">Why Replying to Spam Backfires</Link>.</p>
  </div>;
}

export function SmishingResponse() {
  return <section id="smishing-response" aria-labelledby="smishing-response-heading">
    <h2 id="smishing-response-heading" className="text-xl font-semibold">What did you do?</h2>
    <Accordion type="multiple" className="mt-3">
      {smishingResponses.map((response) => <AccordionItem key={response.id} value={response.id} className="border-border">
        <AccordionTrigger className="gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">
          <span className="min-w-0"><span className="block">{response.label}</span><span className="mt-1 block text-xs font-semibold text-primary">{response.urgency}</span></span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 leading-relaxed motion-reduce:animate-none">
          <p className="font-semibold">{response.firstAction}</p>
          <p className="text-muted-foreground">{response.body}</p>
          <p className="text-xs"><SourceLink index={response.id === "read" || response.id === "tap" ? 0 : 2} /></p>
        </AccordionContent>
      </AccordionItem>)}
    </Accordion>
    <div className="mt-6 space-y-3 text-sm text-muted-foreground">
      <h3 className="font-semibold text-foreground">U.S. reporting</h3>
      <p>Use the messaging app’s spam-reporting feature or forward the text to 7726 (SPAM). Report fraud at <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">ReportFraud.ftc.gov<span className="sr-only"> (opens in a new tab)</span></a>.</p>
      <p className="font-medium text-foreground">If money or account access is at risk, contact the bank or service first; reporting does not secure the account.</p>
      <p className="text-xs"><SourceLink index={0} /> · <SourceLink index={2} /></p>
    </div>
  </section>;
}