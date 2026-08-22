import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, HelpCircle, Share2, Trophy } from "lucide-react";

import { getLessonMetrics } from "@/lib/lesson-metrics.functions";

function Card({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: typeof Trophy }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="text-sm text-muted-foreground">No {label} recorded yet.</p>;
}

/** Cross-device lesson metrics: missed questions, glossary taps, shares, trophies. */
export function LessonMetricsPanel() {
  const fetchMetrics = useServerFn(getLessonMetrics);
  const { data, isPending, isError } = useQuery({
    queryKey: ["lesson-metrics"],
    queryFn: () => fetchMetrics(),
    staleTime: 60_000,
  });

  if (isPending)
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Loading lesson metrics…
      </p>
    );
  if (isError || !data?.allowed)
    return <p className="text-sm text-muted-foreground">Lesson metrics require admin access.</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Most missed quiz questions" icon={HelpCircle}>
        {data.missedQuestions.length === 0 ? (
          <Empty label="quiz answers" />
        ) : (
          <ol className="space-y-3">
            {data.missedQuestions.map((q) => (
              <li key={`${q.lessonId}-${q.question}`} className="text-sm">
                <p className="font-medium">{q.question}</p>
                <p className="text-xs text-muted-foreground">
                  {q.lessonTitle} — missed {q.missed} of {q.answered} answers
                  {q.missRate !== null ? ` (${q.missRate}%)` : ""}
                </p>
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          {data.totalMissed} misses across {data.totalAnswers} answers.
        </p>
      </Card>

      <Card title="Glossary terms people tap" icon={BookOpen}>
        {data.glossaryTerms.length === 0 ? (
          <Empty label="glossary taps" />
        ) : (
          <ul className="space-y-2">
            {data.glossaryTerms.map((t) => (
              <li key={t.term} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{t.label}</span>
                <span className="text-xs text-muted-foreground">{t.taps} taps</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Result cards shared" icon={Share2}>
        <p className="text-3xl font-semibold tracking-tight">{data.shares.total}</p>
        <p className="text-xs text-muted-foreground">
          Times learners shared or saved a result card image
        </p>
        {data.shares.byPlace.length > 0 && (
          <>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Screen it was shared from
            </p>
            <ul className="mt-2 space-y-1">
              {data.shares.byPlace.map((s) => (
                <li key={s.label} className="flex items-baseline justify-between gap-4 text-sm">
                  <span>{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.shares}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {data.shares.byLesson.length > 0 && (
          <>
            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Shares by lesson
            </p>
            <ul className="mt-2 space-y-1">
              {data.shares.byLesson.map((l) => (
                <li key={l.label} className="flex items-baseline justify-between gap-4 text-sm">
                  <span>{l.label}</span>
                  <span className="text-xs text-muted-foreground">{l.shares}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        {data.shares.byFormat.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Formats: {data.shares.byFormat.map((f) => `${f.label} ${f.shares}`).join(" · ")}
          </p>
        )}
      </Card>

      <Card title="Trophies earned" icon={Trophy}>
        <p className="text-3xl font-semibold tracking-tight">{data.trophies}</p>
        <p className="text-xs text-muted-foreground">
          People who finished every lesson and unlocked the Digital Hygiene Champion trophy.
        </p>
      </Card>

      <div className="lg:col-span-2">
        <Card title="Which links drive learners" icon={LinkIcon}>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {data.attribution.onboardingStarts}
              </p>
              <p className="text-xs text-muted-foreground">First quiz starts (onboarding)</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight">
                {data.attribution.quizCompletions}
              </p>
              <p className="text-xs text-muted-foreground">Quizzes completed</p>
            </div>
          </div>

          {data.attribution.sources.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No attributed activity yet. Once visitors arrive from a referring site, their
              onboarding and quiz completions appear here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Onboarding and quiz outcomes by referring domain
                </caption>
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="py-1 pr-4 font-medium">
                      Source
                    </th>
                    <th scope="col" className="py-1 pr-4 font-medium">
                      Starts
                    </th>
                    <th scope="col" className="py-1 pr-4 font-medium">
                      Completions
                    </th>
                    <th scope="col" className="py-1 pr-4 font-medium">
                      Passes
                    </th>
                    <th scope="col" className="py-1 pr-4 font-medium">
                      Trophies
                    </th>
                    <th scope="col" className="py-1 font-medium">
                      Completion rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.attribution.sources.map((s) => (
                    <tr key={s.source} className="border-t border-border/60">
                      <td className="py-1.5 pr-4 font-medium">
                        {s.source === "direct" ? "Direct / no referrer" : s.source}
                      </td>
                      <td className="py-1.5 pr-4 text-muted-foreground">{s.onboardingStarts}</td>
                      <td className="py-1.5 pr-4 text-muted-foreground">{s.quizCompletions}</td>
                      <td className="py-1.5 pr-4 text-muted-foreground">{s.quizPasses}</td>
                      <td className="py-1.5 pr-4 text-muted-foreground">{s.trophies}</td>
                      <td className="py-1.5 text-muted-foreground">
                        {s.completionRate === null ? "—" : `${s.completionRate}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            First-touch attribution: the referring domain (or campaign source) recorded on a
            visitor&rsquo;s first visit, matched to their later lesson activity. Anonymous and
            consent-gated.
          </p>
        </Card>
      </div>
    </div>
  );
}
