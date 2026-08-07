import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { GLOSSARY_CATEGORIES, glossary } from "@/lib/glossary";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "Digital Safety Glossary — Hygi" },
      {
        name: "description",
        content:
          "Plain-language definitions of phishing, MFA, passkeys, VPNs, deepfakes, and other digital safety terms used across Hygi lessons.",
      },
      { property: "og:title", content: "Digital Safety Glossary — Hygi" },
      {
        property: "og:description",
        content:
          "Plain-language definitions of phishing, MFA, passkeys, VPNs, deepfakes, and other digital safety terms used across Hygi lessons.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/glossary" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/glossary" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          name: "Hygi. Digital Safety Glossary",
          hasDefinedTerm: glossary.map((g) => ({
            "@type": "DefinedTerm",
            name: g.term,
            description: g.definition,
          })),
        }),
      },
    ],
  }),
  component: GlossaryPage,
});

function GlossaryPage() {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = glossary.filter((g) =>
      q
        ? g.term.toLowerCase().includes(q) ||
          g.definition.toLowerCase().includes(q) ||
          (g.aliases ?? []).some((a) => a.toLowerCase().includes(q))
        : true,
    );
    return GLOSSARY_CATEGORIES.map((category) => ({
      category,
      items: match
        .filter((g) => g.category === category)
        .sort((a, b) => a.term.localeCompare(b.term)),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const total = glossary.length;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-14">
      <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {total} terms
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Digital Safety Glossary</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every term Hygi. lessons use, in plain language. Inside a lesson you can tap any underlined
        word to read its definition without leaving the page — this glossary is the complete list.
      </p>

      <label className="relative mt-8 block">
        <span className="sr-only">Search glossary terms</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for phishing, passkey, deepfake…"
          className="w-full rounded-full border border-input bg-background py-3 pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </label>

      <nav aria-label="Glossary categories" className="mt-6 flex flex-wrap gap-2">
        {grouped.map(({ category, items }) => (
          <a
            key={category}
            href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {category} ({items.length})
          </a>
        ))}
      </nav>

      {grouped.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground" aria-live="polite">
          No terms match “{query}”. Try a shorter word.
        </p>
      ) : null}

      <div className="mt-10 space-y-12">
        {grouped.map(({ category, items }) => (
          <section
            key={category}
            id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="scroll-mt-24"
          >
            <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
            <dl className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.slug}
                  id={item.slug}
                  className="scroll-mt-24 rounded-2xl border border-border/60 bg-card p-5"
                >
                  <dt className="text-sm font-semibold text-foreground">
                    {item.term}
                    {item.aliases?.length ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        also: {item.aliases.join(", ")}
                      </span>
                    ) : null}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">What it means: </span>
                    {item.definition}
                  </dd>
                  <dd className="mt-3 space-y-2 text-sm leading-relaxed">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Example: </span>
                      {item.example}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">What to do: </span>
                      {item.todo}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Important: </span>
                      {item.important}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        Missing a word?{" "}
        <Link to="/support" className="underline hover:text-foreground">
          Tell us on the support page
        </Link>{" "}
        and we'll add it. Brought to you by NorthBridge.
      </p>
    </main>
  );
}
