import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type MissedQuestionRow = {
  lessonId: string;
  lessonTitle: string;
  question: string;
  missed: number;
  answered: number;
  missRate: number | null;
};

export type TermRow = { term: string; label: string; taps: number };
export type ShareRow = { label: string; shares: number };

export type LessonMetrics = {
  allowed: true;
  totalAnswers: number;
  totalMissed: number;
  missedQuestions: MissedQuestionRow[];
  glossaryTerms: TermRow[];
  shares: { total: number; byFormat: ShareRow[]; bySource: ShareRow[] };
  trophies: number;
};

/** Admin-only aggregate of anonymous lesson activity. */
export const getLessonMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LessonMetrics | { allowed: false }> => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc(
      "current_user_has_role",
      { _role: "admin" },
    );
    if (roleError) throw roleError;
    if (isAdmin !== true) return { allowed: false };

    const { data, error } = await context.supabase
      .from("lesson_metric_events")
      .select("kind, lesson_id, lesson_title, question_index, question, term, share_format")
      .order("created_at", { ascending: false })
      .limit(20000);
    if (error) throw error;
    const rows = data ?? [];

    const questions = new Map<string, MissedQuestionRow>();
    const terms = new Map<string, TermRow>();
    const formats = new Map<string, number>();
    const sources = new Map<string, number>();
    let totalAnswers = 0;
    let totalMissed = 0;
    let shares = 0;
    let trophies = 0;

    for (const r of rows) {
      if (r.kind === "question_missed" || r.kind === "question_answered") {
        const key = `${r.lesson_id ?? ""}#${r.question_index ?? ""}`;
        const row =
          questions.get(key) ??
          {
            lessonId: r.lesson_id ?? "",
            lessonTitle: r.lesson_title ?? r.lesson_id ?? "Unknown lesson",
            question: r.question ?? `Question ${(r.question_index ?? 0) + 1}`,
            missed: 0,
            answered: 0,
            missRate: null,
          };
        row.answered += 1;
        totalAnswers += 1;
        if (r.kind === "question_missed") {
          row.missed += 1;
          totalMissed += 1;
        }
        questions.set(key, row);
      } else if (r.kind === "glossary_open") {
        const slug = r.term ?? r.question ?? "unknown";
        const row = terms.get(slug) ?? { term: slug, label: r.question ?? slug, taps: 0 };
        row.taps += 1;
        terms.set(slug, row);
      } else if (r.kind === "share") {
        shares += 1;
        const f = r.share_format ?? "unknown";
        formats.set(f, (formats.get(f) ?? 0) + 1);
        const s = r.lesson_title ?? r.question ?? "Badges page";
        sources.set(s, (sources.get(s) ?? 0) + 1);
      } else if (r.kind === "trophy") {
        trophies += 1;
      }
    }

    const list = (m: Map<string, number>): ShareRow[] =>
      [...m.entries()]
        .map(([label, shares]) => ({ label, shares }))
        .sort((a, b) => b.shares - a.shares);

    return {
      allowed: true,
      totalAnswers,
      totalMissed,
      missedQuestions: [...questions.values()]
        .map((q) => ({ ...q, missRate: q.answered ? Math.round((q.missed / q.answered) * 100) : null }))
        .filter((q) => q.missed > 0)
        .sort((a, b) => b.missed - a.missed || (b.missRate ?? 0) - (a.missRate ?? 0))
        .slice(0, 15),
      glossaryTerms: [...terms.values()].sort((a, b) => b.taps - a.taps).slice(0, 15),
      shares: { total: shares, byFormat: list(formats), bySource: list(sources).slice(0, 10) },
      trophies,
    };
  });
