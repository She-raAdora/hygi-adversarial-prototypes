import { Fragment, useMemo } from "react";
import { glossary, type GlossaryEntry } from "@/lib/glossary";
import { GlossaryTerm } from "@/components/GlossaryTerm";

/** All term + alias phrases, longest first so "password manager" wins over "password". */
const phrases: { phrase: string; entry: GlossaryEntry }[] = glossary
  .flatMap((entry) => [entry.term, ...(entry.aliases ?? [])].map((phrase) => ({ phrase, entry })))
  .sort((a, b) => b.phrase.length - a.phrase.length);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const matcher = new RegExp(
  `(?<![\\w-])(${phrases.map((p) => escapeRegExp(p.phrase)).join("|")})(?![\\w-])`,
  "gi",
);

const entryByPhrase = new Map(phrases.map((p) => [p.phrase.toLowerCase(), p.entry]));

/**
 * Highlights glossary terms found in plain lesson copy so readers can spot
 * unfamiliar concepts and open the "What does this mean?" popover in place.
 * `seen` de-duplicates highlights across a lesson: only the first mention of
 * each term is marked, keeping the page readable.
 */
export function GlossaryText({ text, seen }: { text: string; seen?: Set<string> }) {
  const parts = useMemo(() => {
    const out: React.ReactNode[] = [];
    let last = 0;
    matcher.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(text))) {
      const entry = entryByPhrase.get(match[0].toLowerCase());
      if (!entry) continue;
      if (seen?.has(entry.slug)) continue;
      seen?.add(entry.slug);
      if (match.index > last) out.push(text.slice(last, match.index));
      out.push(
        <GlossaryTerm key={`${entry.slug}-${match.index}`} term={entry.slug}>
          {match[0]}
        </GlossaryTerm>,
      );
      last = match.index + match[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
