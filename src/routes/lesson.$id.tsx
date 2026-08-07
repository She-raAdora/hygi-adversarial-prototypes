import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trophy, X } from "lucide-react";
import { getLesson, lessons, type Lesson } from "@/lib/lessons";
import { sectionSlug, topicForQuestion } from "@/lib/quizTopics";
import { awardBadge, useProgress } from "@/lib/progress";
import { ShareResultButton } from "@/components/ShareResultButton";
import { GlossaryText } from "@/components/GlossaryText";
import { ReferralGate } from "@/components/ReferralGate";
import { gateFor, isLocked, useReferrals } from "@/lib/referrals";
import { recordQuestionResult } from "@/lib/metrics";
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
      ? (() => {
          const suffix = " — Hygi";
          const base = loaderData.lesson.title;
          const title =
            (base + suffix).length > 60 ? base.slice(0, 60 - suffix.length - 1).trimEnd() + "…" + suffix : base + suffix;
          const intro = loaderData.lesson.intro;
          const description = intro.length > 160 ? intro.slice(0, 157).trimEnd() + "…" : intro;
          return [
            { title },
            { name: "description", content: description },
            { property: "og:title", content: title },
            { property: "og:description", content: description },
            { property: "og:type", content: "article" },
            {
              property: "og:url",
              content: `https://digitalhygiene.app/lesson/${loaderData.lesson.id}`,
            },
            { name: "twitter:card", content: "summary" },
          ];
        })()
      : [
          { title: "Lesson unavailable — Hygi" },
          {
            name: "description",
            content:
              "This Hygi lesson isn't available. Browse the full digital hygiene curriculum to pick another short lesson and mini-quiz.",
          },
          { name: "robots", content: "noindex" },
        ],
    links: loaderData
      ? [
          {
            rel: "canonical",
            href: `https://digitalhygiene.app/lesson/${loaderData.lesson.id}`,
          },
        ]
      : [],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: loaderData.lesson.title,
              description: loaderData.lesson.intro,
              url: `https://digitalhygiene.app/lesson/${loaderData.lesson.id}`,
              provider: { "@type": "Organization", name: "Hygi.", url: "https://digitalhygiene.app" },
              isAccessibleForFree: true,
              teaches: loaderData.lesson.title,
            }),
          },
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
  const [anchor, setAnchor] = useState<string | null>(null);
  const referrals = useReferrals();
  const progress = useProgress();

  // Reset to learn view when navigating between lessons (component is reused).
  useEffect(() => {
    setMode("learn");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [lesson.id]);

  // After jumping back to the lesson from a quiz explanation, scroll to and
  // focus the matching topic heading.
  useEffect(() => {
    if (mode !== "learn" || !anchor) return;
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const h = el.querySelector("h2");
      if (h instanceof HTMLElement) h.focus();
    }
    setAnchor(null);
  }, [mode, anchor]);

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];
  const prev = lessons[idx - 1];
  const locked = isLocked(idx, referrals);
  const gate = gateFor(idx);
  const badgesEarned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length).length;

  // Fresh each render: only the first mention of each glossary term is highlighted.
  const glossarySeen = new Set<string>();

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

      {locked && gate ? (
        <ReferralGate
          index={idx}
          after={gate.after}
          badgesEarned={badgesEarned}
          totalBadges={lessons.length}
        />
      ) : mode === "learn" ? (
        <article className="mt-10 space-y-10">
          <p className="rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            <span className="mr-1 rounded-md bg-primary/10 px-1 font-medium text-foreground underline decoration-primary decoration-dotted decoration-2 underline-offset-4">
              Highlighted words
            </span>
            are glossary terms — tap one for a plain-language definition.
          </p>
          <p className="text-base leading-relaxed">
            <GlossaryText text={lesson.intro} seen={glossarySeen} />
          </p>
          {lesson.sections.map((s: Lesson["sections"][number]) => (
            <section key={s.heading} id={sectionSlug(s.heading)} className="scroll-mt-24">
              <h2
                tabIndex={-1}
                className="text-xl font-semibold tracking-tight focus-visible:outline-none"
              >
                {s.heading}
              </h2>
              <p className="mt-2 text-muted-foreground">
                <GlossaryText text={s.body} seen={glossarySeen} />
              </p>
              <ul className="mt-4 space-y-2">
                {s.tips.map((t: string) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    <span>
                      <GlossaryText text={t} seen={glossarySeen} />
                    </span>
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

          <p className="text-center text-xs text-muted-foreground">
            Brought to you by NorthBridge
          </p>

          <p className="text-center text-xs text-muted-foreground">
            Unfamiliar term?{" "}
            <Link to="/glossary" className="underline underline-offset-4 hover:text-foreground">
              Open the Digital Safety Glossary
            </Link>
          </p>

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
        <Quiz
          lesson={lesson}
          onBackToLearn={(slug?: string) => {
            if (slug) setAnchor(slug);
            setMode("learn");
          }}
          next={next}
        />
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
  onBackToLearn: (slug?: string) => void;
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
        {passed && lesson.urgency && (
          <div className="mt-6 rounded-2xl border border-primary/25 bg-secondary/50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Why this lesson is urgent
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {lesson.urgency}
            </p>
          </div>
        )}
        <div className="mt-8 text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Answer review
          </h3>
          <ol className="mt-3 space-y-3">
          {lesson.quiz.map((qq, i) => {
            const userPick = picks[i];
            const isCorrect = userPick === qq.answer;
            const topic = topicForQuestion(lesson, qq);
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
                {topic && (
                  <button
                    type="button"
                    onClick={() => onBackToLearn(topic.slug)}
                    className="mt-2 inline-flex items-center gap-1 rounded-full text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Review this lesson: {topic.heading}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </li>
            );
          })}
          </ol>
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5 text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Key takeaways
          </h3>
          <ul className="mt-3 space-y-2">
            {Array.from(new Set(lesson.quiz.map((qq) => qq.explain))).map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
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
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            source="quiz result"
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
          onClick={() => onBackToLearn()}
          className="mt-4 rounded-full text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden="true">← </span>Back to lesson
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Brought to you by NorthBridge
        </p>
      </div>

    );
  }

  const q = lesson.quiz[step];
  const topic = topicForQuestion(lesson, q);
  const correct = picked !== null && picked === q.answer;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Question {step + 1} of {total}
        </span>
        <button
          type="button"
          onClick={() => onBackToLearn()}
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
            {topic && (
              <button
                type="button"
                onClick={() => onBackToLearn(topic.slug)}
                className="mt-2 inline-flex items-center gap-1 rounded-full text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Review this lesson: {topic.heading}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <button
        ref={advanceRef}
        type="button"
        disabled={picked === null}
        onClick={() => {
          const nextPicks = [...picks, picked!];
          recordQuestionResult({
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            questionIndex: step,
            question: q.q,
            correct: picked === q.answer,
          });
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