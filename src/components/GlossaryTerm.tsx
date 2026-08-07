import { useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { findGlossaryEntry } from "@/lib/glossary";

type Props = {
  /** Term, alias, or slug to look up in the glossary. */
  term: string;
  /** Optional visible label when the sentence needs different wording. */
  children?: React.ReactNode;
};

/**
 * Inline tap-or-hover definition. Keeps readers inside the lesson: the
 * definition opens in place, with a link to the full glossary entry.
 */
export function GlossaryTerm({ term, children }: Props) {
  const entry = findGlossaryEntry(term);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!entry) return <>{children ?? term}</>;

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hide() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        aria-label={`${children ? String(children) : entry.term} — what does this mean?`}
        className="cursor-help rounded-md bg-primary/10 px-1 font-medium text-foreground underline decoration-primary decoration-dotted decoration-2 underline-offset-4 transition-colors hover:bg-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {children ?? entry.term}
      </button>
      <span
        id={panelId}
        role="tooltip"
        hidden={!open}
        className="absolute bottom-full left-1/2 z-50 mb-2 w-72 max-w-[80vw] -translate-x-1/2 rounded-2xl border border-border bg-popover p-4 text-left text-sm font-normal leading-relaxed text-popover-foreground shadow-lg"
      >
        <span className="block text-sm font-semibold text-foreground">{entry.term}</span>
        <span className="mt-1 block text-muted-foreground">
          <span className="font-medium text-foreground">What it means: </span>
          {entry.definition}
        </span>
        <span className="mt-1.5 block text-muted-foreground">
          <span className="font-medium text-foreground">Example: </span>
          {entry.example}
        </span>
        <span className="mt-1.5 block text-muted-foreground">
          <span className="font-medium text-foreground">What to do: </span>
          {entry.todo}
        </span>
        <span className="mt-1.5 block text-muted-foreground">
          <span className="font-medium text-foreground">Important: </span>
          {entry.important}
        </span>
        <Link
          to="/glossary"
          hash={entry.slug}
          className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-4"
        >
          What does this mean?
        </Link>
      </span>
    </span>
  );
}
