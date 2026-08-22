import { createFileRoute, Link } from "@tanstack/react-router";

import { BacklinkPanel } from "@/components/BacklinkPanel";

export const Route = createFileRoute("/_authenticated/backlinks")({
  head: () => ({
    meta: [
      { title: "Backlink Monitoring — Hygi" },
      {
        name: "description",
        content:
          "Admin view of Hygi's backlink profile: referring domains, link quality signals, and new or lost backlinks over time.",
      },
      { property: "og:title", content: "Backlink Monitoring — Hygi" },
      {
        property: "og:description",
        content:
          "Admin view of Hygi's backlink profile: referring domains, link quality signals, and new or lost backlinks over time.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/backlinks" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/backlinks" }],
  }),
  component: BacklinksPage,
});

function BacklinksPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Backlinks</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Who links to digitalhygiene.app, how trustworthy those links look, and what changed since
        the last capture.
      </p>

      <div className="mt-10">
        <BacklinkPanel />
      </div>

      <p className="mt-12 text-xs text-muted-foreground">
        <Link to="/dashboard" className="underline underline-offset-4 hover:text-foreground">
          Back to the dashboard
        </Link>
      </p>
    </main>
  );
}
