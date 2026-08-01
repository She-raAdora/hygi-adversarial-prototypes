import { createFileRoute } from "@tanstack/react-router";

import {
  clearEventLog,
  summarizeByDay,
  summarizeByLesson,
  summarizeInstalls,
  useEventLog,
} from "@/lib/eventLog";

export const Route = createFileRoute("/insights")({
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
  component: InsightsPage,
});

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

function InsightsPage() {
  const events = useEventLog();
  const installs = summarizeInstalls(events);
  const days = summarizeByDay(events);
  const byLesson = summarizeByLesson(events);

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
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Insights</h1>
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