import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, Trophy } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { gateFor, isLocked, PER_GATE, useReferrals } from "@/lib/referrals";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons — Hygi" },
      {
        name: "description",
        content:
          "Browse the full digital hygiene curriculum — 15 short lessons with pop quizzes and a badge for every topic you master.",
      },
      { property: "og:title", content: "Lessons — Hygi" },
      {
        property: "og:description",
        content:
          "Browse the full digital hygiene curriculum — 15 short lessons with pop quizzes and a badge for every topic you master.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const progress = useProgress();
  const referrals = useReferrals();
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Lessons</h1>
      <p className="mt-3 text-muted-foreground">
        Each one ends with a short pop quiz. After lessons 5, 9 and 14 you unlock the next
        set by sharing your badge card with {PER_GATE} contacts.
      </p>
      <ul className="mt-10 space-y-3">
        {lessons.map((l, i) => {
          const score = progress[l.id] ?? 0;
          const done = score >= l.quiz.length;
          const locked = isLocked(i, referrals);
          const gate = gateFor(i);
          return (
            <li key={l.id}>
              <Link
                to="/lesson/$id"
                params={{ id: l.id }}
                className={`group flex items-center gap-5 rounded-2xl border p-5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  locked
                    ? "border-dashed border-border bg-secondary/30"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                    locked ? "opacity-50 grayscale" : ""
                  }`}
                  style={{ background: "var(--gradient-soft)" }}
                >
                  {l.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Lesson {i + 1}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                        <Trophy className="h-3 w-3" aria-hidden="true" /> Badge earned
                      </span>
                    )}
                    {locked && gate && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Lock className="h-3 w-3" aria-hidden="true" /> {referrals}/{gate.required}{" "}
                        referrals
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold tracking-tight">{l.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {locked && gate
                      ? `Locked — refer ${PER_GATE} contacts after lesson ${gate.after} to unlock`
                      : l.tagline}
                  </p>
                </div>
                {locked ? (
                  <Lock aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}