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