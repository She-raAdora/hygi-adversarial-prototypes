import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Trophy, BookOpen, ExternalLink } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hygi — Learn Digital Hygiene" },
      {
        name: "description",
        content:
          "Bite-sized lessons and pop quizzes on digital hygiene. Earn a badge for every topic you master.",
      },
      { property: "og:title", content: "Hygi — Learn Digital Hygiene" },
      {
        property: "og:description",
        content: "Bite-sized lessons and pop quizzes. Earn badges as you go.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const progress = useProgress();
  const earned = lessons.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length).length;

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
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Based on Dartmouth, Caltech, Cal Poly, and Harvard University digital safety guides
          </div>
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
          15 short lessons. A pop quiz at the end of each. Collect a badge for every
            topic you master, then earn the grand trophy when you finish them all.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/lessons"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-soft)" }}
            >
              Start learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/badges"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Trophy className="h-4 w-4 text-primary" />
              {earned} of {lessons.length} badges
            </Link>
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
              Fifteen habits, one healthier digital you.
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
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <h3 className="text-lg font-semibold tracking-tight">Sources</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Lesson content is adapted from the following university cybersecurity guides:
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://services.dartmouth.edu/TDClient/1806/Portal/KB/Article/155669/Dartmouth-Guide-to-Digital-Hygiene"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Dartmouth — Guide to Digital Hygiene
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://imss.caltech.edu/documents/6692/Cybersecurity_Week_4.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Caltech IMSS — Cybersecurity Week 4
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://imss.caltech.edu/documents/6691/Cybersecurity_Week_3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Caltech IMSS — Cybersecurity Week 3
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://imss.caltech.edu/documents/6690/Cybersecurity_Week_2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Caltech IMSS — Cybersecurity Week 2
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://security.calpoly.edu/top-10-security-practices"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Cal Poly — Top 10 Security Practices
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a
                href="https://www.hsph.harvard.edu/chc/wp-content/uploads/sites/2464/2024/03/Digital-Safety-Kit-for-Public-Health-2024-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Harvard T.H. Chan — Digital Safety Kit for Public Health
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
