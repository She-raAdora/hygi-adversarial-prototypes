import type { Lesson, QuizQ } from "@/lib/lessons";

/** Stable DOM id for a lesson section heading. */
export function sectionSlug(heading: string) {
  return (
    "topic-" +
    heading
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

const STOP = new Set([
  "the","a","an","and","or","of","to","in","on","for","with","your","you","it","is","are",
  "be","that","this","which","what","why","how","when","should","never","best","first","step",
  "from","at","as","not","can","do","does","if","use","using","most","only","its","their",
  "them","they","than","then","into","about","up","down","out","off","so","also","any","all",
]);

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !STOP.has(w))
    .map((w) => (w.endsWith("s") ? w.slice(0, -1) : w));
}

/**
 * Pick the lesson section a quiz question is really about, by keyword overlap
 * between the question/explanation and each section's heading, body and tips.
 * Headings are weighted highest. Falls back to the first section.
 */
export function topicForQuestion(lesson: Lesson, q: QuizQ) {
  const asked = new Set([...tokens(q.q), ...tokens(q.explain), ...tokens(q.options[q.answer] ?? "")]);
  let bestIdx = 0;
  let bestScore = -1;

  lesson.sections.forEach((s, i) => {
    const heading = new Set(tokens(s.heading));
    const bodyish = new Set([...tokens(s.body), ...s.tips.flatMap(tokens)]);
    let score = 0;
    asked.forEach((w) => {
      if (heading.has(w)) score += 3;
      else if (bodyish.has(w)) score += 1;
    });
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  });

  const section = lesson.sections[bestIdx];
  if (!section) return null;
  return { heading: section.heading, slug: sectionSlug(section.heading) };
}
