import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyAccess } from "@/lib/access.functions";
import { SeoHealthPanel } from "@/components/SeoHealthPanel";
import { supabase } from "@/integrations/supabase/client";
import {
  clearEventLog,
  summarizeByDay,
  summarizeByLesson,
  summarizeInstalls,
  summarizeLessonTrends,
  useEventLog,
} from "@/lib/eventLog";
import type { LessonTrend } from "@/lib/eventLog";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Your Hygi. Analytics Dashboard" },
      {
        name: "description",
        content:
          "See your home-screen install funnel and quiz completion by day and by lesson. Measured on this device only.",
      },
      { property: "og:title", content: "Insights — Your Hygi. Analytics Dashboard" },
      {
        property: "og:description",
        content:
          "See your home-screen install funnel and quiz completion by day and by lesson. Measured on this device only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InsightsGate,
});

function InsightsGate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAccess = useServerFn(getMyAccess);
  const { data, isPending, isError } = useQuery({
    queryKey: ["my-access"],
    queryFn: () => fetchAccess(),
    staleTime: 60_000,
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (isPending) {
    return (
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Checking your access…
        </p>
      </main>
    );
  }

  if (isError || !data?.isAdmin) {
    return (
      <main id="main-content" className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight">Insights is admin-only</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {data?.email ? `${data.email} isn't` : "This account isn't"} authorized to view the
          analytics dashboard. Ask an administrator to grant admin access, then reload this page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/lessons"
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to lessons
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return <InsightsPage email={data.email} onSignOut={signOut} />;
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function FunnelBar({
  label,
  value,
  max,
  hint,
}: {
  label: string;
  value: number;
  max: number;
  hint: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value} · {pct}%
        </span>
      </div>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value} events, ${pct} percent of launches`}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </li>
  );
}

function formatDay(day: string) {
  const d = new Date(`${day}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? day
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function shortDay(day: string) {
  const d = new Date(`${day}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? day
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Delta({ value, label }: { value: number | null; label: string }) {
  if (value === null) return null;
  const dir = value > 0 ? "up" : value < 0 ? "down" : "flat";
  const tone =
    dir === "up" ? "text-primary" : dir === "down" ? "text-destructive" : "text-muted-foreground";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "→";
  return (
    <span className={`text-xs font-medium tabular-nums ${tone}`}>
      <span aria-hidden="true">{arrow}</span>{" "}
      {value > 0 ? "+" : ""}
      {value} pts {label}
      <span className="sr-only">
        {dir === "up" ? " increase" : dir === "down" ? " decrease" : " no change"} since the first
        recorded day
      </span>
    </span>
  );
}

/** Grouped day-over-day bars: pass rate and average score per lesson. */
function TrendChart({ trend }: { trend: LessonTrend }) {
  return (
    <ol className="mt-4 flex items-end justify-start gap-5 overflow-x-auto pb-1">
      {trend.points.map((p) => (
        <li key={p.day} className="flex w-16 shrink-0 flex-col items-center gap-2">
          <div className="flex h-28 items-end gap-1" aria-hidden="true">
            <div
              className="w-3.5 rounded-t bg-primary"
              style={{ height: `${Math.max(p.passRate ?? 0, 2)}%` }}
            />
            <div
              className="w-3.5 rounded-t bg-primary/35"
              style={{ height: `${Math.max(p.avgPercent ?? 0, 2)}%` }}
            />
          </div>
          <p className="text-center text-[0.65rem] leading-tight text-muted-foreground">
            <span className="block whitespace-nowrap font-medium text-foreground">
              {shortDay(p.day)}
            </span>
            <span className="tabular-nums">
              {p.passRate === null ? "—" : `${p.passRate}%`} pass
            </span>
            <span className="block tabular-nums">
              {p.avgPercent === null ? "—" : `${p.avgPercent}%`} avg
            </span>
            <span className="block tabular-nums">
              {p.attempts} {p.attempts === 1 ? "attempt" : "attempts"}
            </span>
          </p>
        </li>
      ))}
    </ol>
  );
}

function LessonTrendCard({ trend }: { trend: LessonTrend }) {
  const headingId = `trend-${trend.lessonId}`;
  return (
    <li className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id={headingId} className="text-base font-semibold text-foreground">
          {trend.lessonTitle}
        </h3>
        <p className="text-sm tabular-nums text-muted-foreground">
          {trend.passRate === null ? "—" : `${trend.passRate}%`} pass rate ·{" "}
          {trend.avgPercent === null ? "—" : `${trend.avgPercent}%`} avg score · {trend.attempts}{" "}
          {trend.attempts === 1 ? "attempt" : "attempts"}
        </p>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-4">
        <Delta value={trend.passRateDelta} label="pass rate" />
        <Delta value={trend.avgPercentDelta} label="avg score" />
      </div>

      {trend.points.length < 2 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Only one day of attempts so far — retake this quiz on another day to see a trend.
        </p>
      ) : null}

      <TrendChart trend={trend} />

      <table className="sr-only">
        <caption>
          {trend.lessonTitle}: pass rate, average percent correct and attempts by day
        </caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Attempts</th>
            <th scope="col">Pass rate</th>
            <th scope="col">Average percent correct</th>
          </tr>
        </thead>
        <tbody>
          {trend.points.map((p) => (
            <tr key={p.day}>
              <th scope="row">{formatDay(p.day)}</th>
              <td>{p.attempts}</td>
              <td>{p.passRate === null ? "not available" : `${p.passRate}%`}</td>
              <td>{p.avgPercent === null ? "not available" : `${p.avgPercent}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </li>
  );
}

function InsightsPage({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const events = useEventLog();
  const installs = summarizeInstalls(events);
  const days = summarizeByDay(events);
  const byLesson = summarizeByLesson(events);
  const trends = summarizeLessonTrends(events);

  const totalStarts = byLesson.reduce((a, r) => a + r.starts, 0);
  const totalCompletions = byLesson.reduce((a, r) => a + r.completions, 0);
  const totalPasses = byLesson.reduce((a, r) => a + r.passes, 0);
  const completionRate = totalStarts ? Math.round((totalCompletions / totalStarts) * 100) : 0;
  const passRate = totalCompletions ? Math.round((totalPasses / totalCompletions) * 100) : 0;
  const funnelMax = Math.max(installs.launches, 1);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Analytics
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">Insights</h1>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {email ? <span>Signed in as {email}</span> : null}
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg border border-input bg-background px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign out
          </button>
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The install-to-home-screen funnel and quiz activity measured on{" "}
        <strong className="font-semibold text-foreground">this device</strong>. Nothing here is
        uploaded — it's read from local storage in your browser. Aggregate numbers across all
        visitors live in your Google Analytics property.
      </p>

      {events.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground">
          No activity recorded on this device yet. Take a pop quiz or add Hygi. to your home screen,
          then come back.
        </p>
      ) : null}

      <section aria-labelledby="overview-heading" className="mt-10">
        <h2 id="overview-heading" className="text-xl font-semibold tracking-tight">
          Overview
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Quizzes started" value={totalStarts} />
          <Stat label="Quizzes completed" value={totalCompletions} hint={`${completionRate}% of starts`} />
          <Stat label="Perfect scores" value={totalPasses} hint={`${passRate}% of completions`} />
          <Stat
            label="Home-screen installs"
            value={installs.installs + installs.conversions}
            hint="Prompt installs plus first standalone launches"
          />
        </div>
      </section>

      <section aria-labelledby="funnel-heading" className="mt-12">
        <h2 id="funnel-heading" className="text-xl font-semibold tracking-tight">
          Install-to-home-screen funnel
        </h2>
        <ul className="mt-4 space-y-5 rounded-2xl border border-border/60 bg-card p-6">
          <FunnelBar
            label="App opened"
            value={installs.launches}
            max={funnelMax}
            hint="Every launch, in a browser tab or installed window."
          />
          <FunnelBar
            label="Install prompt offered"
            value={installs.promptsAvailable}
            max={funnelMax}
            hint="Browser signalled the app is installable. iOS Safari never fires this."
          />
          <FunnelBar
            label="Installed"
            value={installs.installs}
            max={funnelMax}
            hint="Confirmed install via the browser prompt."
          />
          <FunnelBar
            label="Launched from home screen"
            value={installs.conversions}
            max={funnelMax}
            hint="The conversion — first standalone open. This is how iOS installs are counted."
          />
          <FunnelBar
            label="Standalone sessions"
            value={installs.standaloneLaunches}
            max={funnelMax}
            hint="Repeat usage from the installed app."
          />
        </ul>
      </section>

      <section aria-labelledby="byday-heading" className="mt-12">
        <h2 id="byday-heading" className="text-xl font-semibold tracking-tight">
          Quiz completion by day
        </h2>
        {days.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No quiz activity yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Quiz starts, completions, perfect scores and badges earned per day
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Day
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Started
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Completed
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Perfect
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.day} className="border-b border-border/40 last:border-0">
                    <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">
                      {formatDay(d.day)}
                    </th>
                    <td className="px-5 py-3 text-right tabular-nums">{d.quizStarts}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{d.quizCompletions}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{d.passes}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{d.badges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="bylesson-heading" className="mt-12">
        <h2 id="bylesson-heading" className="text-xl font-semibold tracking-tight">
          Quiz completion by lesson
        </h2>
        {byLesson.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No quiz activity yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Quiz starts, completions, perfect scores and average score per lesson
              </caption>
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Lesson
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Started
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Completed
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Perfect
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Avg score
                  </th>
                </tr>
              </thead>
              <tbody>
                {byLesson.map((l) => (
                  <tr key={l.lessonId} className="border-b border-border/40 last:border-0">
                    <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">
                      {l.lessonTitle}
                    </th>
                    <td className="px-5 py-3 text-right tabular-nums">{l.starts}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{l.completions}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{l.passes}</td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {l.avgPercent === null ? "—" : `${l.avgPercent}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="trends-heading" className="mt-12">
        <h2 id="trends-heading" className="text-xl font-semibold tracking-tight">
          Pass rate trends by lesson
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Day-by-day pass rate, average percent correct, and number of attempts for each lesson. An
          attempt is one finished quiz; a pass is a perfect score. The{" "}
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary align-middle" aria-hidden="true" />{" "}
          solid bar is pass rate, the{" "}
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/35 align-middle" aria-hidden="true" />{" "}
          lighter bar is average score.
        </p>
        {trends.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No finished quizzes yet — trends appear after your first completed quiz.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {trends.map((t) => (
              <LessonTrendCard key={t.lessonId} trend={t} />
            ))}
          </ul>
        )}
      </section>

      <SeoHealthPanel />

      {events.length > 0 ? (
        <div className="mt-12">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear the analytics recorded on this device?")) clearEventLog();
            }}
            className="inline-flex items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Clear this device's data
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Clearing only affects this dashboard — your badges and lesson progress stay put.
          </p>
        </div>
      ) : null}
    </main>
  );
}