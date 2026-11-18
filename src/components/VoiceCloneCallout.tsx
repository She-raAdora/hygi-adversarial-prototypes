import { ChevronDown, AudioLines } from "lucide-react";
import { voiceCloneCallout as c } from "@/lib/voiceCloneCallout";

export function VoiceCloneCallout() {
  return (
    <details id="voice-recorded-or-cloned" className="group mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-start gap-2 text-lg font-semibold [&::-webkit-details-marker]:hidden">
        <AudioLines aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
        <span className="flex-1">{c.title}</span>
        <ChevronDown aria-hidden="true" className="mt-1 size-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.intro}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {c.kinds.map((k) => (
          <li key={k.term}><span className="font-semibold">{k.term}:</span> <span className="text-muted-foreground">{k.body}</span></li>
        ))}
      </ul>
      {c.sections.map((s) => (
        <p key={s.heading} className="mt-4 text-sm leading-relaxed">
          <span className="font-semibold">{s.heading}:</span> <span className="text-muted-foreground">{s.body}</span>
        </p>
      ))}
      <p className="mt-4 border-t border-primary/20 pt-4 text-xs leading-relaxed text-muted-foreground">{c.checklistNote}</p>
      <ul className="mt-2 space-y-2 text-sm">
        {c.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
              {s.title}<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="block text-xs text-muted-foreground">{s.note}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
