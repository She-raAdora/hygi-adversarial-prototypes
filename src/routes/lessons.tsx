import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Trophy } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { lessonTint } from "@/lib/lessonTints";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons — Hygi Digital Hygiene Curriculum" },
      {
        name: "description",
        content:
          "Browse the full Hygi curriculum: short digital hygiene lessons, each with a mini-quiz and a badge for every topic you master.",
      },
      { property: "og:title", content: "Lessons — Hygi Digital Hygiene Curriculum" },
      {
        property: "og:description",
        content:
          "Browse the full Hygi curriculum: short digital hygiene lessons, each with a mini-quiz and a badge for every topic you master.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/lessons" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/lessons" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Hygi Digital Hygiene Curriculum",
          description:
            "Browse the full Hygi curriculum: short digital hygiene lessons, each with a mini-quiz and a badge for every topic you master.",
          url: "https://digitalhygiene.app/lessons",
          isPartOf: { "@type": "WebSite", name: "Hygi", url: "https://digitalhygiene.app" },
          mainEntity: {
            "@type": "ItemList",
            name: "Digital hygiene lessons",
            numberOfItems: lessons.length,
            itemListElement: lessons.map((l, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: l.title,
              description: l.tagline,
              url: `https://digitalhygiene.app/lesson/${l.id}`,
            })),
          },
        }),
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const progress = useProgress();
  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Lessons</h1>
      <p className="mt-3 text-muted-foreground">
        Each one ends with a short pop quiz — work through them in any order.
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
                className="group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ background: lessonTint(i, done) }}
                >
                  {l.emoji}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Lesson {i + 1}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success-strong">
                        <Trophy className="h-3 w-3" aria-hidden="true" /> Badge earned
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold tracking-tight">{l.title}</h2>
                  <p className="text-sm text-muted-foreground">{l.tagline}</p>
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}