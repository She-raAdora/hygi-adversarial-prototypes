import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getBacklinkSnapshots } from "@/lib/backlinks.functions";
import { getBacklinkAlertData } from "@/lib/backlink-alerts.functions";
import { assessBacklinkRisk } from "@/lib/backlinkRisk";
import { buildDisavowFile } from "@/lib/disavow";

const DEFAULT_NOTE =
  "Disavow file for digitalhygiene.app\nThese sites are link farms or paid-link networks that linked to Hygi without our request.\nWe did not buy, trade or ask for these links and ask that Google ignore them.";

export const Route = createFileRoute("/_authenticated/backlinks_/disavow")({
  head: () => ({
    meta: [
      { title: "Spam Links to Disavow — Hygi" },
      { name: "description", content: "Admin list of spammy sites linking to Hygi, with a ready-to-upload Google disavow file." },
      { property: "og:title", content: "Spam Links to Disavow — Hygi" },
      { property: "og:description", content: "Admin list of spammy sites linking to Hygi, with a ready-to-upload Google disavow file." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DisavowPage,
});

function DisavowPage() {
  const fetchSnapshots = useServerFn(getBacklinkSnapshots);
  const fetchAlertData = useServerFn(getBacklinkAlertData);
  const snaps = useQuery({ queryKey: ["backlink-snapshots"], queryFn: () => fetchSnapshots() });
  const alerts = useQuery({ queryKey: ["backlink-alert-data"], queryFn: () => fetchAlertData() });

  const latest = snaps.data?.[0];
  const flagged = useMemo(() => {
    if (!latest) return [];
    const trusted = (alerts.data?.trusted ?? []).filter((t) => t.kind === "domain").map((t) => t.value);
    return assessBacklinkRisk({ domains: latest.domains ?? [], anchors: [], trustedDomains: trusted })
      .domains.filter((d) => !d.trusted && d.level !== "low");
  }, [latest, alerts.data]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  useEffect(() => {
    setSelected(new Set(flagged.filter((d) => d.level === "high").map((d) => d.domain)));
  }, [flagged]);
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [copied, setCopied] = useState(false);

  const file = buildDisavowFile([...selected], note, new Date().toISOString().slice(0, 10));

  const toggle = (domain: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });

  const download = () => {
    const url = URL.createObjectURL(new Blob([file], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "hygi-disavow.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Spam links to disavow</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Sites from the latest Semrush capture that look like spam. Tick the ones you want Google to
        ignore, then upload the file below with Google's disavow tool.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">1. Choose the sites</h2>
        {snaps.isPending ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : !latest ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No capture yet. Refresh on the Backlinks page first.
          </p>
        ) : flagged.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No spammy sites in the latest capture.</p>
        ) : (
          <>
            <p className="mt-2 text-xs text-muted-foreground">
              Captured {new Date(latest.captured_at).toLocaleDateString()} · {flagged.length} flagged ·{" "}
              {selected.size} selected. High-risk sites are ticked for you.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelected(new Set(flagged.map((d) => d.domain)))}>
                Select all
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
            <ul className="mt-4 divide-y rounded-lg border">
              {flagged.map((d) => (
                <li key={d.domain} className="flex items-start gap-3 p-3">
                  <Checkbox
                    id={`d-${d.domain}`}
                    checked={selected.has(d.domain)}
                    onCheckedChange={() => toggle(d.domain)}
                    className="mt-1"
                  />
                  <label htmlFor={`d-${d.domain}`} className="flex-1 cursor-pointer">
                    <span className="font-medium">{d.domain}</span>{" "}
                    <span className={d.level === "high" ? "text-destructive text-xs font-semibold" : "text-xs text-muted-foreground"}>
                      {d.level === "high" ? "High risk" : "Medium risk"} · {d.score}/100
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {d.backlinks ?? "?"} links · authority {d.authority ?? "?"} · {d.reasons.slice(0, 2).join("; ")}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">2. Your message to Google</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Saved as notes at the top of the file. Google doesn't reply to them, but they record why you did this.
        </p>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-3" aria-label="Message to Google" />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">3. Download and upload</h2>
        <pre className="mt-3 max-h-64 overflow-auto rounded-lg border bg-muted p-4 text-xs">{file}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={download} disabled={selected.size === 0}>Download disavow file</Button>
          <Button
            variant="outline"
            onClick={async () => {
              await navigator.clipboard.writeText(file);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Copied" : "Copy text"}
          </Button>
          <Button variant="outline" asChild>
            <a href="https://search.google.com/search-console/disavow-links" target="_blank" rel="noreferrer">
              Open Google's disavow tool
            </a>
          </Button>
        </div>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Open Google's disavow tool and pick the digitalhygiene.app property.</li>
          <li>Upload hygi-disavow.txt. A new upload replaces the old one, so always upload the full list.</li>
          <li>Google usually takes a few weeks to process it.</li>
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          Google says it already ignores most spam links on its own, so only disavow sites you're sure are junk.
        </p>
      </section>

      <p className="mt-12 text-xs text-muted-foreground">
        <Link to="/backlinks" className="underline underline-offset-4 hover:text-foreground">Back to Backlinks</Link>
      </p>
    </main>
  );
}
