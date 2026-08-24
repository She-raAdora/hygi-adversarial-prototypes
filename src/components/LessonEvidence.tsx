import { useId, useState } from "react";
import { ChevronDown, ExternalLink, ShieldCheck } from "lucide-react";

import type { LessonSource } from "@/lib/lessons";

/**
 * Expandable "Evidence behind this lesson" panel.
 *
 * Reusable across any lesson: pass the lesson's optional `sources` array. Kept
 * collapsed by default so the lesson body stays clean and consumer-friendly.
 */
export function LessonEvidence({ sources }: { sources: LessonSource[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (sources.length === 0) return null;

  return (
    <section className="border-t border-border pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        {open ? "Hide the evidence" : "Evidence behind this lesson"}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div id={panelId} hidden={!open} className="mt-4">
        <p className="text-sm text-muted-foreground">
          Why Hygi. recommends this — the guidance above follows these published sources:
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {sources.map((source) => (
            <li key={source.url} className="rounded-xl border border-border bg-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {source.org}
              </p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-start gap-1 font-medium text-foreground hover:text-primary hover:underline"
              >
                <span>{source.title}</span>
                <ExternalLink className="mt-1 h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              {source.note ? (
                <p className="mt-1 text-sm text-muted-foreground">{source.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
