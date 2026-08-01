import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trophy, X } from "lucide-react";
import { getLesson, lessons, type Lesson } from "@/lib/lessons";
import { awardBadge, useProgress } from "@/lib/progress";
import { ShareResultButton } from "@/components/ShareResultButton";
import {
  trackAllLessonsComplete,
  trackQuizComplete,
  trackQuizStart,
} from "@/lib/analytics";

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
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

  // Reset to learn view when navigating between lessons (component is reused).
  useEffect(() => {
    setMode("learn");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [lesson.id]);

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];
  const prev = lessons[idx - 1];

  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <Link
        to="/lessons"
        className="inline-flex items-center gap-1 rounded-full text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All lessons
      </Link>

      <header className="mt-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden="true">
            {lesson.emoji}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <button
            type="button"
            onClick={() => {
              trackQuizStart(lesson.id, lesson.title);
              setMode("quiz");
            }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
          >
            Take the pop quiz for {lesson.title}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>

          <nav
            aria-label="Lesson navigation"
            className="flex items-center justify-between gap-3 border-t border-border pt-6"
          >
            {prev ? (
              <Link
                to="/lesson/$id"
                params={{ id: prev.id }}
                aria-label={`Previous lesson: ${prev.title}`}
                className="group inline-flex max-w-[48%] flex-col rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Previous
                </span>
                <span className="mt-1 font-medium">
                  <span aria-hidden="true">{prev.emoji} </span>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/lesson/$id"
                params={{ id: next.id }}
                aria-label={`Next lesson: ${next.title}`}
                className="group inline-flex max-w-[48%] flex-col rounded-2xl border border-border bg-card px-4 py-3 text-right text-sm hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Next <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="mt-1 font-medium">
                  <span aria-hidden="true">{next.emoji} </span>
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
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
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const advanceRef = useRef<HTMLButtonElement>(null);

  // Move focus to the new question (or the result) so keyboard and screen-reader
  // users land on the fresh content instead of a stale/removed element.
  useEffect(() => {
    if (step >= lesson.quiz.length) resultRef.current?.focus();
    else questionRef.current?.focus();
  }, [step, lesson.quiz.length]);

  // Answering disables the option inputs, which drops focus — send it to the
  // button that continues the quiz.
  useEffect(() => {
    if (picked !== null) advanceRef.current?.focus();
  }, [picked]);

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
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
        >
          <Trophy className="h-7 w-7" />
        </div>
        <h2
          ref={resultRef}
          tabIndex={-1}
          className="mt-5 text-2xl font-semibold tracking-tight focus-visible:outline-none"
        >
          {passed ? "Badge unlocked!" : "Nice effort!"}
        </h2>
        <p className="mt-2 text-muted-foreground" role="status">
          You scored {score} / {total}.{" "}
          {passed
            ? "You've earned the " + lesson.title + " badge."
            : "Get all answers right to earn this badge."}
        </p>
        <div className="mt-8 text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Answer review
          </h3>
          <ol className="mt-3 space-y-3">
          {lesson.quiz.map((qq, i) => {
            const userPick = picks[i];
            const isCorrect = userPick === qq.answer;
            return (
              <li
                key={i}
                className={`rounded-2xl border p-4 ${
                  isCorrect
                    ? "border-success/40 bg-success/5"
                    : "border-destructive/40 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
                      aria-hidden="true"
                    />
                  )}
                  <p className="text-sm font-medium">
                    <span className="sr-only">
                      {isCorrect ? "Answered correctly. " : "Answered incorrectly. "}
                    </span>
                    {qq.q}
                  </p>
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
              </li>
            );
          })}
          </ol>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPicks([]);
              setPicked(null);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry quiz
          </button>
          <ShareResultButton
            card={{
              eyebrow: passed ? "Badge unlocked" : "Quiz complete",
              title: lesson.title,
              stat: `${score} / ${total} correct`,
              emoji: lesson.emoji,
              note: passed
                ? "Earned a digital hygiene badge on Hygi."
                : "Practising safer digital habits on Hygi.",
            }}
            text={`I scored ${score}/${total} on the "${lesson.title}" digital hygiene quiz on Hygi.`}
            label="Share result"
          />
          {next ? (
            <Link
              to="/lesson/$id"
              params={{ id: next.id }}
              onClick={() => {
                setStep(0);
                setPicks([]);
                setPicked(null);
              }}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ background: "var(--gradient-hero)" }}
            >
              Next: {next.title} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to="/badges"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ background: "var(--gradient-hero)" }}
            >
              See your badges <Trophy className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={onBackToLearn}
          className="mt-4 rounded-full text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden="true">← </span>Back to lesson
        </button>
      </div>
    );
  }

  const q = lesson.quiz[step];
  const correct = picked !== null && picked === q.answer;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Question {step + 1} of {total}
        </span>
        <button
          type="button"
          onClick={onBackToLearn}
          className="rounded-full hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Review lesson
        </button>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={`Question ${step + 1} of ${total}`}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(step / total) * 100}%`,
            background: "var(--gradient-hero)",
          }}
        />
      </div>

      <h2
        ref={questionRef}
        tabIndex={-1}
        className="mt-8 text-2xl font-semibold tracking-tight focus-visible:outline-none"
      >
        {q.q}
      </h2>
      <fieldset className="mt-6 border-0 p-0" disabled={picked !== null}>
        <legend className="sr-only">{q.q}</legend>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = i === q.answer;
            const reveal = picked !== null;
            let cls = "border-border bg-card hover:border-primary/40";
            if (reveal && isAnswer) cls = "border-success/60 bg-success/10";
            else if (reveal && isPicked) cls = "border-destructive/60 bg-destructive/10";
            return (
              <label
                key={opt}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background has-[:disabled]:cursor-default ${cls}`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`lesson-${lesson.id}-question-${step}`}
                    value={i}
                    checked={isPicked}
                    onChange={() => setPicked(i)}
                    className="h-4 w-4 shrink-0 accent-primary"
                  />
                  <span>{opt}</span>
                </span>
                {reveal && isAnswer && (
                  <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                )}
                {reveal && isPicked && !isAnswer && (
                  <X className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div role="status" aria-live="polite" className="empty:hidden">
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
      </div>

      <button
        ref={advanceRef}
        type="button"
        disabled={picked === null}
        onClick={() => {
          const nextPicks = [...picks, picked!];
          if (nextPicks.length >= total) {
            const finalScore = nextPicks.reduce(
              (acc, p, i) => acc + (p === lesson.quiz[i].answer ? 1 : 0),
              0,
            );
            const passed = finalScore === total;
            trackQuizComplete({
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              score: finalScore,
              total,
              passed,
            });
            if (passed) {
              const mastered = new Set(
                Object.entries(progress)
                  .filter(([id, s]) => s === getLesson(id)?.quiz.length)
                  .map(([id]) => id),
              );
              mastered.add(lesson.id);
              if (mastered.size >= lessons.length) trackAllLessonsComplete(lessons.length);
            }
          }
          setPicks(nextPicks);
          setPicked(null);
          setStep((s) => s + 1);
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-medium text-primary-foreground transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
      >
        {step + 1 === total ? "Finish quiz" : "Next question"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}