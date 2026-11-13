import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DisavowDomainTracker } from "@/components/DisavowDomainTracker";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { getBacklinkSnapshots } from "@/lib/backlinks.functions";
import { getBacklinkAlertData } from "@/lib/backlink-alerts.functions";
import { assessBacklinkRisk } from "@/lib/backlinkRisk";
import { buildDisavowFile, summarizeDisavowUploads, disavowCounts } from "@/lib/disavow";
import { buildPreparedDisavow, flaggedDomainEntries, preparedDisavowDomains, preparedDisavowLines } from "@/lib/spamLinks";

const DEFAULT_NOTE =
  "Disavow file for digitalhygiene.app\nThese sites are link farms or paid-link networks that linked to Hygi without our request.\nWe did not buy, trade or ask for these links and ask that Google ignore them.";

export const Route = createFileRoute("/_authenticated/backlinks_/disavow")({
  validateSearch: (search: Record<string, unknown>): { source?: "blocker" | "links" | "semrush" } => ({ source: search.source === "links" || search.source === "semrush" ? search.source : "blocker" }),
  head: () => ({
    meta: [
      { title: "Google Disavow: Spam Links & Upload Guide — Hygi" },
      { name: "description", content: "Review spam links, download your disavow file, follow Google's upload steps and track each submitted domain’s acceptance status." },
      { property: "og:title", content: "Google Disavow: Spam Links & Upload Guide — Hygi" },
      { property: "og:description", content: "Review spam links, download your disavow file, follow Google's upload steps and track each submitted domain’s acceptance status." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DisavowPage,
});

function DisavowPage() {
  const { source = "blocker" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const entries = useQuery({ queryKey: ["spam-link-entries"], queryFn: async () => {
    const rows = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase.from("spam_link_entries").select("*").order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
      if (error) throw error;
      rows.push(...(data ?? []));
      if (!data || data.length < 500) return rows;
      offset += 500;
    }
  } });
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

  const preparedEntries = source === "blocker" ? flaggedDomainEntries(entries.data ?? []) : entries.data ?? [];
  const preparedLines = preparedDisavowLines(preparedEntries);
  const uploadedDomains = source === "semrush" ? [...selected] : preparedDisavowDomains(preparedEntries);
  const fileReady = source === "semrush" ? snaps.isSuccess && alerts.isSuccess : entries.isSuccess;
  const file = source === "semrush" ? buildDisavowFile([...selected], note, new Date().toISOString().slice(0, 10)) : preparedLines.length ? buildPreparedDisavow(preparedEntries) : "# No ready entries included yet\n";

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
      <h1 className="text-4xl font-semibold tracking-tight">Google Disavow</h1>
      <p className="mt-3 text-sm"><Link to="/backlinks/overview" className="underline underline-offset-4">Spam domain dashboard →</Link></p>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Spam links to disavow: choose your prepared file or latest Semrush capture, download it and open
        Google's upload page. The upload happens on Google, not inside Hygi, and requires your Google sign-in.
      </p>

      <aside className="mt-6 border-l-4 border-destructive bg-muted p-4" aria-label="Before you disavow links">
        <h2 className="text-base font-semibold">Before you upload</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Google says most sites do not need to disavow links. Use this only when substantial artificial
          or spam links have caused, or are likely to cause, a manual action. A Semrush risk score alone
          does not establish that. Incorrectly disavowing good links can harm your search performance.
        </p>
        <a href="https://support.google.com/webmasters/answer/2648487" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline underline-offset-4">
          Read Google's official guidance
        </a>
      </aside>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">1. Choose the sites</h2>
        <label className="mt-4 block text-sm font-medium">File source
          <select aria-label="File source" className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={source} onChange={(event) => {
            const value = event.target.value;
            if (value === "blocker" || value === "links" || value === "semrush") void navigate({ search: { source: value }, replace: true });
          }}>
            <option value="blocker">Spam Blocker — flagged domains</option>
            <option value="links">Spam Link Manager — all ready entries</option>
            <option value="semrush">Semrush — selected sites</option>
          </select>
        </label>
        <p className="mt-2 text-sm"><Link to="/backlinks/links" className="underline underline-offset-4">Manage individual spam links and duplicates →</Link></p>
        {source !== "semrush" ? <>
          {entries.isPending ? <p className="mt-4 text-sm text-muted-foreground">Loading prepared entries…</p> : null}
          {entries.isError ? <div className="mt-4"><p role="alert" className="text-sm text-destructive">Couldn't load prepared entries. Recording is unavailable.</p><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
          {entries.isSuccess ? <p className="mt-4 text-sm text-muted-foreground">{uploadedDomains.length} domains · {preparedLines.length - uploadedDomains.length} URL-specific links. Only ready entries are included; duplicate flags and repeated entries stay excluded. URL-specific links remain in the file but are not counted as whole-domain submissions.</p> : null}
        </> : snaps.isPending ? (
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

      {source === "semrush" ? <section className="mt-12">
        <h2 className="text-xl font-semibold">2. Your message to Google</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Saved as notes at the top of the file. Google doesn't reply to them, but they record why you did this.
        </p>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-3" aria-label="Message to Google" />
      </section> : null}

      <section className="mt-12">
        <h2 className="text-xl font-semibold">3. Upload your file on Google</h2>
        <pre className="mt-3 max-h-64 overflow-auto rounded-lg border bg-muted p-4 text-xs">{file}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={download} disabled={!fileReady || (source === "semrush" ? !selected.size : !preparedLines.length)}>Download disavow file</Button>
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
        <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm text-muted-foreground">
          <li><strong className="text-foreground">Download hygi-disavow.txt.</strong> Keep the file as plain text. If you previously uploaded a list, include the old entries you still want disavowed; this file contains only the entries shown above. When recording, choose the same file source you uploaded and check its preview matches your complete replacement file.</li>
          <li><strong className="text-foreground">Open Google's disavow tool.</strong> Use the button above to open a new tab, then sign in with the Google account that owns the site in Search Console.</li>
          <li><strong className="text-foreground">Choose the verified URL-prefix property for your site.</strong> For this site, look for https://digitalhygiene.app/. Domain properties (shown as sc-domain:) are not supported. If the URL-prefix property is missing, add and verify it in Search Console first.</li>
          <li><strong className="text-foreground">Upload your complete .txt file.</strong> Choose Google's upload or replace option and select hygi-disavow.txt from your downloads. Each upload replaces the previous list for that property. If Google reports file errors, correct them and upload again.</li>
          <li><strong className="text-foreground">Check Google's confirmation.</strong> Only after Google confirms acceptance, return here to record the uploaded file in step 4 and update each domain’s status. Hygi cannot check Google's acceptance automatically.</li>
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          Acceptance does not mean processing is finished. Google may take a few weeks to incorporate the list;
          the links can still appear in Search Console and Semrush afterward. This asks Google to ignore links,
          not remove them from other websites.
        </p>
      </section>

      <UploadLog key={`${source}:${uploadedDomains.join(",")}`} selected={uploadedDomains} fileReady={fileReady} />

      <p className="mt-12 text-xs text-muted-foreground">
        <Link to="/backlinks" className="underline underline-offset-4 hover:text-foreground">Back to Backlinks</Link>
      </p>
    </main>
  );
}

function UploadLog({ selected, fileReady }: { selected: string[]; fileReady: boolean }) {
  const qc = useQueryClient();
  const log = useQuery({
    queryKey: ["disavow-uploads"],
    queryFn: async () => {
      const fetchPage = (offset: number) => supabase
        .from("disavow_uploads")
        .select("id, uploaded_at, domains_selected, domains_accepted, disavow_domain_statuses(id, domain, status, updated_at, threat_category)")
        .order("uploaded_at", { ascending: false })
        .order("id", { ascending: false })
        .range(offset, offset + 499);
      const first = await fetchPage(0);
      if (first.error) throw first.error;
      const uploads = [...(first.data ?? [])];
      let pageSize = uploads.length;
      while (pageSize === 500) {
        const next = await fetchPage(uploads.length);
        if (next.error) throw next.error;
        uploads.push(...(next.data ?? []));
        pageSize = next.data?.length ?? 0;
      }
      return uploads;
    },
  });
  const save = useMutation({
    mutationFn: async () => {
      if (!fileReady || !selected.length) throw new Error("No domains available to record.");
      const domains = [...new Set(selected.map((domain) => domain.trim().toLowerCase()))];
      const { error } = await supabase.from("disavow_uploads").insert({
        domains_selected: domains.length,
        domains_accepted: 0,
        domains,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["disavow-uploads"] }),
        qc.invalidateQueries({ queryKey: ["spam-link-submitted-history"] }),
      ]);
    },
  });
  const last = log.data?.[0];
  const summary = summarizeDisavowUploads(log.data ?? []);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">4. Mark as uploaded</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Record the complete file you actually uploaded. Domains begin as pending; mark accepted or rejected only from Google's confirmation or file errors below. Do not record a file that Google refused as an uploaded replacement.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">{selected.length} domains in your file</span>
        <Button onClick={() => save.mutate()} disabled={!fileReady || selected.length === 0 || save.isPending}>
          {save.isPending ? "Saving…" : "Mark as uploaded"}
        </Button>
      </div>
      {save.isError ? <p className="mt-2 text-sm text-destructive">Couldn't save. Try again.</p> : null}
      {save.isSuccess ? <p className="mt-2 text-sm text-primary">Saved.</p> : null}
      {last ? (
        <p className="mt-6 text-sm">
          Last upload {new Date(last.uploaded_at).toLocaleDateString()}: {" "}
          <strong>{disavowCounts(last).accepted}</strong> accepted, {disavowCounts(last).pending} pending, {disavowCounts(last).rejected} rejected · recorded manually.
        </p>
      ) : log.isSuccess ? (
        <p className="mt-6 text-sm text-muted-foreground">No uploads recorded yet.</p>
      ) : null}
      {log.isSuccess ? (
        <div className="mt-10">
          <h3 className="text-lg font-semibold">Disavow dashboard</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Latest recorded replacement file. Counts come from individual domain statuses recorded by an admin, not automatic Google verification. Pending means unconfirmed acceptance, not Google processing; rejected domains are counted separately.
          </p>
          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              { label: "Submitted", value: summary.latest.submitted },
              { label: "Accepted", value: summary.latest.accepted },
              { label: "Pending confirmation", value: summary.latest.pending },
              { label: "Rejected", value: summary.latest.rejected },
            ].map((item) => (
              <div key={item.label} className="border-t-2 border-border py-4">
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="mt-2 text-3xl font-semibold tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
          <h4 className="mt-6 text-base font-semibold">Monthly trend</h4>
          <p className="mt-2 text-sm text-muted-foreground">Last recorded file in each month, using its currently recorded domain statuses, not summed uploads. Months without records are omitted.</p>
          {summary.monthly.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No submissions recorded yet. Record your first upload above to start the trend.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-96 text-left text-sm tabular-nums">
                <caption className="sr-only">Monthly submitted, accepted, pending and rejected domain counts</caption>
                <thead className="border-b border-border"><tr>
                  <th scope="col" className="py-3 pr-4">Month</th>
                  <th scope="col" className="py-3 pr-4 text-right">Submitted</th>
                  <th scope="col" className="py-3 pr-4 text-right">Accepted</th>
                  <th scope="col" className="py-3 pr-4 text-right">Pending</th>
                  <th scope="col" className="py-3 text-right">Rejected</th>
                </tr></thead>
                <tbody>{summary.monthly.map((month) => (
                  <tr key={month.month} className="border-b border-border">
                    <th scope="row" className="py-3 pr-4 font-medium">{new Date(`${month.month}-01T00:00:00Z`).toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" })}</th>
                    <td className="py-3 pr-4 text-right">{month.submitted}</td>
                    <td className="py-3 pr-4 text-right text-primary">{month.accepted}</td>
                    <td className="py-3 pr-4 text-right">{month.pending}</td>
                    <td className="py-3 text-right">{month.rejected}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
      {log.isSuccess ? <DisavowDomainTracker uploads={log.data} /> : null}
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Google acceptance timeline</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Counts you recorded after each upload, newest first. Each upload replaces the previous
          list, so these counts are not a running total or an automatic confirmation from Google.
        </p>
        {log.isPending ? <p className="mt-4 text-sm text-muted-foreground">Loading upload history…</p> : null}
        {log.isError ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p role="alert" className="text-sm text-destructive">Couldn't load the upload timeline.</p>
            <Button variant="outline" size="sm" onClick={() => void log.refetch()}>Try again</Button>
          </div>
        ) : null}
        {log.isSuccess && log.data.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">Your first recorded upload will appear here.</p>
        ) : null}
        {log.data && log.data.length > 0 ? (
          <>
            <ol aria-label="Recorded Google disavow uploads" className="mt-6 ml-2 border-l-2 border-border">
              {log.data.slice(0, 20).map((u, index) => (
                <li key={u.id} className="relative pb-8 pl-6 last:pb-0">
                  <span aria-hidden="true" className="absolute -left-2 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <time dateTime={u.uploaded_at} className="text-sm font-medium">
                      {new Date(u.uploaded_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                    </time>
                    {index === 0 ? <span className="text-xs font-medium text-primary">Latest upload</span> : null}
                  </div>
                  <p className="mt-2 text-base"><strong className="text-primary">{disavowCounts(u).accepted}</strong> accepted · {disavowCounts(u).pending} pending · {disavowCounts(u).rejected} rejected</p>
                  <p className="mt-1 text-sm text-muted-foreground">Out of {u.domains_selected} domains in that file · recorded by an admin</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-muted-foreground">Showing the most recent {Math.min(log.data.length, 20)} of {log.data.length} uploads.</p>
          </>
        ) : null}
      </div>
    </section>
  );
}
