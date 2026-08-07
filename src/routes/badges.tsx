import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { resetProgress, useProgress } from "@/lib/progress";
import { ShareResultButton } from "@/components/ShareResultButton";
import { LessonSources } from "@/components/LessonSources";
import { lessonTint, lessonTintShadow } from "@/lib/lessonTints";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Your Badges — Hygi" },
      {
        name: "description",
        content:
          "Track your progress and view every digital hygiene badge you have earned, plus the trophy for finishing all 22 lessons.",
      },
      { property: "og:title", content: "Your Badges — Hygi" },
      {
        property: "og:description",
        content:
          "Track your progress and view every digital hygiene badge you have earned, plus the trophy for finishing all 22 lessons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BadgesPage,
});

function BadgesPage() {
  const progress = useProgress();
  const earned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length);
  const allDone = earned.length === lessons.length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Your badges</h1>
          <p className="mt-2 text-muted-foreground">
            {earned.length} of {lessons.length} earned. Ace every question to unlock a badge.
          </p>
        </div>
        {earned.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
          <ShareResultButton
            card={{
              eyebrow: allDone ? "All badges earned" : "Badge progress",
              title: allDone ? "Digital Hygiene Champion" : "My digital hygiene badges",
              stat: `${earned.length} / ${lessons.length} badges`,
              emoji: allDone ? "🏆" : "🛡️",
              note: allDone
                ? "Completed every lesson in the Hygi. curriculum."
                : "Learning safer digital habits, one lesson at a time.",
            }}
            text={`I've earned ${earned.length}/${lessons.length} digital hygiene badges on Hygi.`}
            label="Share progress"
            source="badge progress"
          />
          <button
            onClick={() => {
              if (confirm("Reset all progress?")) resetProgress();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          </div>
        )}
      </div>

      {allDone && (
        <div
          className="mt-10 flex flex-col items-center rounded-3xl border border-primary/30 bg-card p-8 text-center"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div
            className="flex h-24 w-24 items-center justify-center rounded-2xl text-5xl"
            style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
          >
            🏆
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight">
            Digital Hygiene Champion
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            You've earned every badge in the curriculum. The internet is a little safer because of you.
          </p>
          <div className="mt-6">
            <ShareResultButton
              card={{
                eyebrow: "All badges earned",
                title: "Digital Hygiene Champion",
                stat: `${lessons.length} / ${lessons.length} badges`,
                emoji: "🏆",
                note: "Completed every lesson in the Hygi. curriculum.",
              }}
              text={`I completed all ${lessons.length} Hygi. lessons and earned the Digital Hygiene Champion trophy.`}
              label="Share trophy"
              variant="solid"
              source="trophy"
            />
          </div>
          <LessonSources />
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l, i) => {
          const score = progress[l.id] ?? 0;
          const done = score >= l.quiz.length;
          return (
            <div
              key={l.id}
              className={`relative flex flex-col items-center rounded-3xl border p-6 text-center transition-all ${
                done ? "border-primary/30 bg-card" : "border-dashed border-border bg-secondary/30"
              }`}
              style={done ? { boxShadow: "var(--shadow-soft)" } : undefined}
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
                style={{
                  background: lessonTint(i, done),
                  boxShadow: done ? lessonTintShadow(i) : undefined,
                }}
              >
                {l.emoji}
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{l.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{l.tagline}</p>
              {done ? (
                <>
                  <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                    <Trophy className="h-3 w-3" /> Earned
                  </span>
                  {l.urgency && (
                    <div className="mt-4 rounded-2xl bg-secondary/50 p-4 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Why this one matters
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {l.urgency}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/lesson/$id"
                  params={{ id: l.id }}
                  className="mt-4 inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Lock className="h-3 w-3" /> {score > 0 ? `${score}/${l.quiz.length} — try again` : "Locked"}
                </Link>
              )}
          </div>
        );
      })}
    </div>

    <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5 text-primary" />
      Based on Dartmouth, Caltech, Cal Poly, Harvard University's, and CISA's cybersecurity and digital safety guides
    </div>
  </main>
);
}