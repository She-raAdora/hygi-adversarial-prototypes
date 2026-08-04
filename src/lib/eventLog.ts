import { useEffect, useState } from "react";

/**
 * Device-local mirror of the analytics events this browser has sent.
 *
 * Google Analytics owns the aggregate cross-user reporting; this log exists so
 * the app can render its own dashboard without shipping any data anywhere.
 * It never leaves the device and holds no personal information.
 */

export type LoggedEvent = {
  /** Event name, e.g. "quiz_complete". */
  n: string;
  /** ISO timestamp. */
  t: string;
  /** Event params (lesson id, score, install method, …). */
  p: Record<string, unknown>;
};

const KEY = "hygi-event-log-v1";
const MAX = 2000;

export function readEventLog(): LoggedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? (raw as LoggedEvent[]) : [];
  } catch {
    return [];
  }
}

export function logEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const log = readEventLog();
    log.push({ n: name, t: new Date().toISOString(), p: params });
    localStorage.setItem(KEY, JSON.stringify(log.slice(-MAX)));
    window.dispatchEvent(new Event("hygi-events"));
  } catch {
    /* storage full or blocked — analytics is best-effort */
  }
}

export function clearEventLog() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("hygi-events"));
}

export function useEventLog() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  useEffect(() => {
    const sync = () => setEvents(readEventLog());
    sync();
    window.addEventListener("hygi-events", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hygi-events", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return events;
}

/* --------------------------------------------------------------- summaries */

export type DayRow = {
  day: string;
  quizStarts: number;
  quizCompletions: number;
  passes: number;
  badges: number;
};

export type LessonRow = {
  lessonId: string;
  lessonTitle: string;
  starts: number;
  completions: number;
  passes: number;
  avgPercent: number | null;
};

export type InstallFunnel = {
  launches: number;
  promptsAvailable: number;
  installs: number;
  conversions: number;
  standaloneLaunches: number;
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function summarizeByDay(events: LoggedEvent[]): DayRow[] {
  const map = new Map<string, DayRow>();
  for (const e of events) {
    const day = e.t.slice(0, 10);
    if (!day) continue;
    const row =
      map.get(day) ??
      ({ day, quizStarts: 0, quizCompletions: 0, passes: 0, badges: 0 } satisfies DayRow);
    if (e.n === "quiz_start") row.quizStarts += 1;
    if (e.n === "quiz_complete") {
      row.quizCompletions += 1;
      if (e.p["passed"] === true) row.passes += 1;
    }
    if (e.n === "badge_earned") row.badges += 1;
    map.set(day, row);
  }
  return [...map.values()]
    .filter((r) => r.quizStarts + r.quizCompletions + r.badges > 0)
    .sort((a, b) => (a.day < b.day ? 1 : -1));
}

export function summarizeByLesson(events: LoggedEvent[]): LessonRow[] {
  const map = new Map<string, LessonRow & { percentSum: number; percentCount: number }>();
  for (const e of events) {
    if (e.n !== "quiz_start" && e.n !== "quiz_complete") continue;
    const lessonId = str(e.p["lesson_id"]);
    if (!lessonId) continue;
    const row =
      map.get(lessonId) ??
      {
        lessonId,
        lessonTitle: str(e.p["lesson_title"], lessonId),
        starts: 0,
        completions: 0,
        passes: 0,
        avgPercent: null,
        percentSum: 0,
        percentCount: 0,
      };
    if (str(e.p["lesson_title"])) row.lessonTitle = str(e.p["lesson_title"]);
    if (e.n === "quiz_start") row.starts += 1;
    else {
      row.completions += 1;
      if (e.p["passed"] === true) row.passes += 1;
      const pct = num(e.p["percent_correct"]);
      if (pct !== null) {
        row.percentSum += pct;
        row.percentCount += 1;
      }
    }
    map.set(lessonId, row);
  }
  return [...map.values()]
    .map(({ percentSum, percentCount, ...row }) => ({
      ...row,
      avgPercent: percentCount ? Math.round(percentSum / percentCount) : null,
    }))
    .sort((a, b) => b.starts - a.starts || a.lessonTitle.localeCompare(b.lessonTitle));
}

export function summarizeInstalls(events: LoggedEvent[]): InstallFunnel {
  const count = (fn: (e: LoggedEvent) => boolean) => events.filter(fn).length;
  return {
    launches: count((e) => e.n === "app_launch"),
    promptsAvailable: count((e) => e.n === "install_prompt_available"),
    installs: count((e) => e.n === "app_installed"),
    conversions: count((e) => e.n === "install_conversion"),
    standaloneLaunches: count((e) => e.n === "app_launch" && e.p["display_mode"] === "standalone"),
  };
}

/* ------------------------------------------------------------------ trends */

/** One day of quiz activity for a single lesson. */
export type TrendPoint = {
  day: string;
  /** Quizzes finished that day (an attempt = one completed quiz). */
  attempts: number;
  passes: number;
  /** Pass rate 0-100, null when there were no attempts. */
  passRate: number | null;
  /** Mean percent correct across that day's attempts, null when unknown. */
  avgPercent: number | null;
};

export type LessonTrend = {
  lessonId: string;
  lessonTitle: string;
  attempts: number;
  passes: number;
  passRate: number | null;
  avgPercent: number | null;
  /** Oldest day first, so the series reads left to right. */
  points: TrendPoint[];
  /** Change in pass rate between the first and last day with attempts. */
  passRateDelta: number | null;
  /** Change in average percent correct between the first and last day. */
  avgPercentDelta: number | null;
};

/**
 * Per-lesson pass rate and average score, bucketed by day, from quiz_complete
 * events. Only completed quizzes count as attempts.
 */
export function summarizeLessonTrends(events: LoggedEvent[]): LessonTrend[] {
  type Acc = { attempts: number; passes: number; pctSum: number; pctCount: number };
  const lessons = new Map<string, { title: string; days: Map<string, Acc> }>();

  for (const e of events) {
    if (e.n !== "quiz_complete") continue;
    const lessonId = str(e.p["lesson_id"]);
    const day = e.t.slice(0, 10);
    if (!lessonId || !day) continue;

    const lesson = lessons.get(lessonId) ?? { title: str(e.p["lesson_title"], lessonId), days: new Map() };
    if (str(e.p["lesson_title"])) lesson.title = str(e.p["lesson_title"]);

    const acc = lesson.days.get(day) ?? { attempts: 0, passes: 0, pctSum: 0, pctCount: 0 };
    acc.attempts += 1;
    if (e.p["passed"] === true) acc.passes += 1;
    const pct = num(e.p["percent_correct"]);
    if (pct !== null) {
      acc.pctSum += pct;
      acc.pctCount += 1;
    }
    lesson.days.set(day, acc);
    lessons.set(lessonId, lesson);
  }

  const rate = (passes: number, attempts: number) =>
    attempts ? Math.round((passes / attempts) * 100) : null;

  return [...lessons.entries()]
    .map(([lessonId, lesson]) => {
      const points: TrendPoint[] = [...lesson.days.entries()]
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([day, a]) => ({
          day,
          attempts: a.attempts,
          passes: a.passes,
          passRate: rate(a.passes, a.attempts),
          avgPercent: a.pctCount ? Math.round(a.pctSum / a.pctCount) : null,
        }));

      const attempts = points.reduce((n, p) => n + p.attempts, 0);
      const passes = points.reduce((n, p) => n + p.passes, 0);
      const pctPoints = points.filter((p) => p.avgPercent !== null);
      const avgPercent = pctPoints.length
        ? Math.round(
            pctPoints.reduce((n, p) => n + (p.avgPercent as number) * p.attempts, 0) /
              pctPoints.reduce((n, p) => n + p.attempts, 0),
          )
        : null;

      const first = points[0];
      const last = points[points.length - 1];
      const spansDays = points.length > 1 && first !== undefined && last !== undefined;

      return {
        lessonId,
        lessonTitle: lesson.title,
        attempts,
        passes,
        passRate: rate(passes, attempts),
        avgPercent,
        points,
        passRateDelta:
          spansDays && first.passRate !== null && last.passRate !== null
            ? last.passRate - first.passRate
            : null,
        avgPercentDelta:
          spansDays && first.avgPercent !== null && last.avgPercent !== null
            ? last.avgPercent - first.avgPercent
            : null,
      } satisfies LessonTrend;
    })
    .sort((a, b) => b.attempts - a.attempts || a.lessonTitle.localeCompare(b.lessonTitle));
}
/* -------------------------------------------------------------- experiments */

export type ExperimentRow = {
  variant: string;
  /** Homepage impressions for this variant. */
  views: number;
  /** Primary CTA clicks. */
  clicks: number;
  /** CTA click-through rate 0-100, null with no views. */
  ctr: number | null;
  /** Quizzes started by visitors in this variant (the engagement signal). */
  quizStarts: number;
  quizCompletions: number;
  badges: number;
  /** Quiz starts per homepage view, 0-100. */
  engagementRate: number | null;
};

/**
 * Groups every logged event by its A/B variant so the dashboard can compare
 * CTA wording and placement on clicks *and* on downstream learning activity.
 */
export function summarizeExperiments(events: LoggedEvent[]): ExperimentRow[] {
  const map = new Map<string, ExperimentRow>();
  const row = (variant: string) => {
    const existing = map.get(variant);
    if (existing) return existing;
    const created: ExperimentRow = {
      variant,
      views: 0,
      clicks: 0,
      ctr: null,
      quizStarts: 0,
      quizCompletions: 0,
      badges: 0,
      engagementRate: null,
    };
    map.set(variant, created);
    return created;
  };

  for (const e of events) {
    const variant = str(e.p["variant"]);
    if (!variant) continue;
    const r = row(variant);
    if (e.n === "experiment_view") r.views += 1;
    else if (e.n === "cta_click") r.clicks += 1;
    else if (e.n === "quiz_start") r.quizStarts += 1;
    else if (e.n === "quiz_complete") r.quizCompletions += 1;
    else if (e.n === "badge_earned") r.badges += 1;
  }

  const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : null);
  return [...map.values()]
    .map((r) => ({ ...r, ctr: pct(r.clicks, r.views), engagementRate: pct(r.quizStarts, r.views) }))
    .sort((a, b) => a.variant.localeCompare(b.variant));
}
