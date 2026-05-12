import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trophy, X } from "lucide-react";
import { getLesson, lessons, type Lesson } from "@/lib/lessons";
import { awardBadge, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/lesson/$id")({
  loader: ({ params }) => {
    const lesson = getLesson(params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.title} — Hygi` },
          { name: "description", content: loaderData.lesson.intro },
          { property: "og:title", content: `${loaderData.lesson.title} — Hygi` },
          { property: "og:description", content: loaderData.lesson.intro },
        ]
      : [],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Couldn't load this lesson</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-3xl font-semibold">Lesson not found</h1>
      <Link to="/lessons" className="mt-4 inline-block text-primary hover:underline">
        Back to lessons
      </Link>
    </div>
  ),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData() as { lesson: Lesson };
  const [mode, setMode] = useState<"learn" | "quiz">("learn");

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        to="/lessons"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All lessons
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{lesson.emoji}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            Lesson {idx + 1}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{lesson.tagline}</p>
      </header>

      {mode === "learn" ? (
        <article className="mt-10 space-y-10">
          <p className="text-base leading-relaxed">{lesson.intro}</p>
          {lesson.sections.map((s: Lesson["sections"][number]) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold tracking-tight">{s.heading}</h2>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
              <ul className="mt-4 space-y-2">
                {s.tips.map((t: string) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <button
            onClick={() => setMode("quiz")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
          >
            Take the pop quiz
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </article>
      ) : (
        <Quiz lesson={lesson} onBackToLearn={() => setMode("learn")} next={next} />
      )}
    </main>
  );
}

function Quiz({
  lesson,
  onBackToLearn,
  next,
}: {
  lesson: Lesson;
  onBackToLearn: () => void;
  next?: { id: string; title: string };
}) {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const progress = useProgress();
  const previousBest = progress[lesson.id] ?? 0;

  const total = lesson.quiz.length;
  const score = useMemo(
    () => picks.reduce((acc, p, i) => acc + (p === lesson.quiz[i].answer ? 1 : 0), 0),
    [picks, lesson],
  );

  if (step >= total) {
    const passed = score === total;
    if (passed && score > previousBest) awardBadge(lesson.id, score);
    else if (score > previousBest) awardBadge(lesson.id, score);

    return (
      <div className="mt-12 rounded-3xl border border-border bg-card p-8 text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <Trophy className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">
          {passed ? "Badge unlocked!" : "Nice effort!"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          You scored {score} / {total}.{" "}
          {passed
            ? "You've earned the " + lesson.title + " badge."
            : "Get all answers right to earn this badge."}
        </p>
        <div className="mt-8 space-y-3 text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Answer review
          </h3>
          {lesson.quiz.map((qq, i) => {
            const userPick = picks[i];
            const isCorrect = userPick === qq.answer;
            return (
              <div
                key={i}
                className={`rounded-2xl border p-4 ${
                  isCorrect
                    ? "border-success/40 bg-success/5"
                    : "border-destructive/40 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )}
                  <p className="text-sm font-medium">{qq.q}</p>
                </div>
                {!isCorrect && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Your answer:</span>{" "}
                    {qq.options[userPick]}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Correct:</span>{" "}
                  {qq.options[qq.answer]}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{qq.explain}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setStep(0);
              setPicks([]);
              setPicked(null);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" /> Retry quiz
          </button>
          {next ? (
            <Link
              to="/lesson/$id"
              params={{ id: next.id }}
              onClick={() => {
                setStep(0);
                setPicks([]);
                setPicked(null);
              }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              Next: {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/badges"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              See your badges <Trophy className="h-4 w-4" />
            </Link>
          )}
        </div>
        <button
          onClick={onBackToLearn}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to lesson
        </button>
      </div>
    );
  }

  const q = lesson.quiz[step];
  const correct = picked !== null && picked === q.answer;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>Question {step + 1} of {total}</span>
        <button onClick={onBackToLearn} className="hover:text-foreground">
          Review lesson
        </button>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(step / total) * 100}%`,
            background: "var(--gradient-hero)",
          }}
        />
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-tight">{q.q}</h2>
      <div className="mt-6 space-y-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isAnswer = i === q.answer;
          const reveal = picked !== null;
          let cls = "border-border bg-card hover:border-primary/40";
          if (reveal && isAnswer) cls = "border-success/60 bg-success/10";
          else if (reveal && isPicked) cls = "border-destructive/60 bg-destructive/10";
          return (
            <button
              key={opt}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-all ${cls}`}
            >
              <span>{opt}</span>
              {reveal && isAnswer && <Check className="h-4 w-4 text-success" />}
              {reveal && isPicked && !isAnswer && <X className="h-4 w-4 text-destructive" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div
          className={`mt-6 rounded-2xl border p-4 text-sm ${
            correct ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
          }`}
        >
          <p className="font-medium">{correct ? "Correct!" : "Not quite."}</p>
          <p className="mt-1 text-muted-foreground">{q.explain}</p>
        </div>
      )}

      <button
        disabled={picked === null}
        onClick={() => {
          setPicks((p) => [...p, picked!]);
          setPicked(null);
          setStep((s) => s + 1);
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-medium text-primary-foreground transition-opacity disabled:opacity-40"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
      >
        {step + 1 === total ? "Finish quiz" : "Next question"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}