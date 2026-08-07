import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy, BookOpen, CircleCheck, Sparkles, Play } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { useHomeCtaVariant } from "@/lib/useHomeCtaVariant";
import { trackCtaClick } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hygi — Digital & Cyber Hygiene Lessons" },
      {
        name: "description",
        content:
          "Learn digital and cyber hygiene in bite-sized lessons from university and government security guides. Take a mini-quiz and earn a badge per topic.",
      },
      { property: "og:title", content: "Hygi — Digital & Cyber Hygiene Lessons" },
      {
        property: "og:description",
        content:
          "Learn digital and cyber hygiene in bite-sized lessons from university and government security guides. Take a mini-quiz and earn a badge per topic.",
      },
      { property: "og:url", content: "https://digitalhygiene.app/" },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/87cf0ff7-cc52-415f-b7ba-f9cf8a6fd547",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/87cf0ff7-cc52-415f-b7ba-f9cf8a6fd547",
      },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/" }],
  }),
  component: Index,
});

function Index() {
  const progress = useProgress();
  const earned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length).length;

  const nextLesson = lessons.find((l) => (progress[l.id] ?? 0) < l.quiz.length) ?? lessons[0];
  const hasStarted = lessons.some((l) => (progress[l.id] ?? 0) > 0);
  const preview = lessons[0];
  const previewQuestion = preview.quiz[0];

  // A/B test: CTA wording and placement (see src/lib/experiments.ts).
  const variant = useHomeCtaVariant();
  const ctaCopy = hasStarted ? variant.returningCopy : variant.copy;

  const ctaBlock = (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        to="/lesson/$id"
        params={{ id: nextLesson.id }}
        onClick={() => trackCtaClick(variant.id, variant.placement, ctaCopy)}
        className="group inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
      >
        {ctaCopy}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        to="/lessons"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-4 text-base font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <BookOpen className="h-4 w-4 text-primary" />
        Explore all lessons
      </Link>
    </div>
  );
  const ctaAboveHeadline = variant.placement === "above-headline";

  return (
    <main>
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-soft)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-50"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-6xl px-6 py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            No signup required
          </span>
          {ctaAboveHeadline ? (
            <div className="mt-6">
              <p className="mb-3 text-sm text-muted-foreground">Brought to you by NorthBridge</p>
              {ctaBlock}
            </div>
          ) : null}
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
            Self-care for your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              digital life.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            5-minute bite-sized lessons from Dartmouth, Caltech, Cal Poly, Harvard, and CISA. Read a lesson, take a
            mini-quiz, and earn a badge for every topic you master.
          </p>
          {ctaAboveHeadline ? null : (
            <>
              <div className="mt-8">{ctaBlock}</div>
              <p className="mt-5 text-sm text-muted-foreground">Brought to you by NorthBridge</p>
            </>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">22 lessons</p>
                <p className="text-muted-foreground">5 minutes each</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CircleCheck className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">Mini-quiz</p>
                <p className="text-muted-foreground">After each lesson</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-foreground">{earned} of {lessons.length} badges</p>
                <p className="text-muted-foreground">+ a trophy at the end</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              The curriculum
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Good habits, one healthier digital you.
            </h2>
          </div>
          <Link
            to="/lessons"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:inline-flex"
          >
            All lessons <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((l, i) => {
            const score = progress[l.id] ?? 0;
            const done = score >= l.quiz.length;
            return (
              <Link
                key={l.id}
                to="/lesson/$id"
                params={{ id: l.id }}
                className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1"
                style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.02)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{l.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Lesson {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{l.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.tagline}</p>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <BookOpen className="h-4 w-4" /> {l.sections.length} sections · {l.quiz.length} quiz
                  </span>
                  {done ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                      <Trophy className="h-3 w-3" /> Earned
                    </span>
                  ) : score > 0 ? (
                    <span className="text-xs text-muted-foreground">{score}/{l.quiz.length}</span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{preview.emoji}</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Lesson preview
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">{preview.title}</h2>
              </div>
            </div>
            <p className="text-muted-foreground">{preview.intro}</p>
            <div className="mt-6 rounded-2xl border border-border bg-background p-5">
              <p className="text-sm font-medium text-foreground">Sample quiz question</p>
              <p className="mt-1 text-sm text-muted-foreground">{previewQuestion.q}</p>
              <div className="mt-3 space-y-2">
                {previewQuestion.options.map((option, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground"
                  >
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border"
                      aria-hidden="true"
                    />
                    {option}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success">
                <strong>Correct:</strong> {previewQuestion.options[previewQuestion.answer]}
                <p className="mt-1 text-xs opacity-90">{previewQuestion.explain}</p>
              </div>
            </div>
            <Link
              to="/lesson/$id"
              params={{ id: preview.id }}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="h-4 w-4" />
              Start this lesson
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">How Hygi works</h2>
            <p className="mt-2 text-muted-foreground">
              A tiny routine that keeps you safer online, one lesson at a time.
            </p>
            <ol className="mt-6 space-y-4">
              {[
                { title: "Choose a lesson", body: "Pick any topic — there is no fixed order." },
                { title: "Read quick tips", body: "Each lesson is a short, practical guide with actionable advice." },
                { title: "Take the mini-quiz", body: "Answer a few quick questions to test what you learned." },
                { title: "Earn your badge", body: "Get a badge for every topic you master, then win the trophy." },
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

    </main>
  );
}
