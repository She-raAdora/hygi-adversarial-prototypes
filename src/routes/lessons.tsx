import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons — Hygi" },
      { name: "description", content: "Browse the full digital hygiene curriculum." },
      { property: "og:title", content: "Lessons — Hygi" },
      { property: "og:description", content: "Browse the full digital hygiene curriculum." },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const progress = useProgress();
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Lessons</h1>
      <p className="mt-3 text-muted-foreground">
        Work through them in any order. Each one ends with a short pop quiz.
      </p>
      <ul className="mt-10 space-y-3">
        {lessons.map((l, i) => {
          const score = progress[l.id] ?? 0;
          const done = score >= l.quiz.length;
          return (
            <li key={l.id}>
              <Link
                to="/lesson/$id"
                params={{ id: l.id }}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
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
                        <Trophy className="h-3 w-3" /> Badge
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold tracking-tight">{l.title}</h3>
                  <p className="text-sm text-muted-foreground">{l.tagline}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}