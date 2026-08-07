import { useEffect, useId, useRef, useState } from "react";
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
 *
 * Keyboard support: Tab focuses the term, Enter/Space toggles the definition,
 * Escape closes it and returns focus to the term, and the definition's contents
 * (including the glossary link) are reachable with Tab only while open.
 */
export function GlossaryTerm({ term, children }: Props) {
  const entry = findGlossaryEntry(term);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const headingId = `${panelId}-title`;
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside pointer press so keyboard and pointer users share behavior.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  if (!entry) return <>{children ?? term}</>;

  const label = children ? String(children) : entry.term;

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
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        // Keep it open while focus moves between the term and the definition.
        if (wrapperRef.current?.contains(event.relatedTarget as Node)) return;
        hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-describedby={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        aria-label={`${label} — what does this mean? Press Enter for the definition.`}
        className="cursor-help rounded-md bg-primary/10 px-1 font-medium text-foreground underline decoration-primary decoration-dotted decoration-2 underline-offset-4 transition-colors hover:bg-primary/20 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {children ?? entry.term}
      </button>
      <span
        id={panelId}
        role="group"
        aria-labelledby={headingId}
        hidden={!open}
        className="absolute bottom-full left-1/2 z-50 mb-2 w-72 max-w-[80vw] -translate-x-1/2 rounded-2xl border border-border bg-popover p-4 text-left text-sm font-normal leading-relaxed text-popover-foreground shadow-lg"
      >
        <span id={headingId} className="block text-sm font-semibold text-foreground">
          {entry.term}
        </span>
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
        <span className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/glossary"
            hash={entry.slug}
            aria-label={`Open the full glossary entry for ${entry.term}`}
            className="text-xs font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            What does this mean?
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label={`Close the definition of ${entry.term}`}
            className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Close
          </button>
        </span>
      </span>
    </span>
  );
}
