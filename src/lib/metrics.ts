/**
 * Anonymous, aggregate lesson metrics.
 *
 * These rows power the admin dashboard: which quiz questions people miss, which
 * glossary terms they tap, how often results are shared, and how many people
 * finish every lesson. Nothing identifying is ever recorded — no account id, no
 * name, no answer text tied to a person — and nothing is sent until the visitor
 * opts in on the consent banner.
 */

import { supabase } from "@/integrations/supabase/client";
import { hasAnalyticsConsent } from "./consent";

type MetricRow = {
  kind: "question_missed" | "question_answered" | "glossary_open" | "share" | "trophy";
  lesson_id?: string | null;
  lesson_title?: string | null;
  question_index?: number | null;
  question?: string | null;
  term?: string | null;
  share_format?: string | null;
};

/** Fire-and-forget insert. Failures are ignored: metrics must never block the UI. */
function record(row: MetricRow) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  void supabase
    .from("lesson_metric_events")
    .insert(row)
    .then(() => undefined, () => undefined);
}

export function recordQuestionResult(args: {
  lessonId: string;
  lessonTitle: string;
  questionIndex: number;
  question: string;
  correct: boolean;
}) {
  record({
    kind: args.correct ? "question_answered" : "question_missed",
    lesson_id: args.lessonId,
    lesson_title: args.lessonTitle,
    question_index: args.questionIndex,
    question: args.question,
  });
}

export function recordGlossaryOpen(term: string, slug: string) {
  record({ kind: "glossary_open", term: slug, question: term });
}

export function recordShare(args: {
  format: string;
  lessonId?: string | undefined;
  lessonTitle?: string | undefined;
  source?: string | undefined;
}) {
  record({
    kind: "share",
    share_format: args.format,
    lesson_id: args.lessonId ?? null,
    lesson_title: args.lessonTitle ?? null,
    question: args.source ?? null,
  });
}

export function recordTrophy(lessonsCompleted: number) {
  record({ kind: "trophy", question_index: lessonsCompleted });
}
