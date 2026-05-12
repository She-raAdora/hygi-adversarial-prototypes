import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, RotateCcw, Trophy } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { resetProgress, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Your Badges — Hygi" },
      { name: "description", content: "Track every digital hygiene badge you've earned." },
      { property: "og:title", content: "Your Badges — Hygi" },
      { property: "og:description", content: "Track every digital hygiene badge you've earned." },
    ],
  }),
  component: BadgesPage,
});

function BadgesPage() {
  const progress = useProgress();
  const earned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length);

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
          <button
            onClick={() => {
              if (confirm("Reset all progress?")) resetProgress();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => {
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
                className={`flex h-20 w-20 items-center justify-center rounded-2xl text-4xl ${
                  done ? "" : "grayscale opacity-50"
                }`}
                style={
                  done
                    ? { background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }
                    : { background: "var(--muted)" }
                }
              >
                {l.emoji}
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{l.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{l.tagline}</p>
              {done ? (
                <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                  <Trophy className="h-3 w-3" /> Earned
                </span>
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
    </main>
  );
}