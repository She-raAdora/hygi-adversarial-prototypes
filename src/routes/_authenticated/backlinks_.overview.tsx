import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DisavowDomainTracker } from "@/components/DisavowDomainTracker";
import { disavowTypeBreakdown, summarizeDisavowUploads } from "@/lib/disavow";

export const Route = createFileRoute("/_authenticated/backlinks_/overview")({
  head: () => ({ meta: [
    { title: "Spam Domain Dashboard — Hygi" },
    { name: "description", content: "Track recorded spam-domain submissions, acceptance, pending confirmations, monthly trends and spam types." },
    { property: "og:title", content: "Spam Domain Dashboard — Hygi" },
    { property: "og:description", content: "Recorded disavow progress by month and phishing, malware or scam classification." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: OverviewPage,
});

function OverviewPage() {
  const uploads = useQuery({ queryKey: ["disavow-uploads"], queryFn: async () => {
    const all = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase.from("disavow_uploads").select("id, uploaded_at, domains_selected, domains_accepted, disavow_domain_statuses(id, domain, status, updated_at, threat_category)").order("uploaded_at", { ascending: false }).order("id", { ascending: false }).range(offset, offset + 499);
      if (error) throw error;
      all.push(...(data ?? []));
      if (!data || data.length < 500) return all;
      offset += 500;
    }
  } });
  const summary = summarizeDisavowUploads(uploads.data ?? []);
  const types = disavowTypeBreakdown(uploads.data?.[0]);
  const metrics = [{ label: "Submitted", value: summary.latest.submitted }, { label: "Accepted", value: summary.latest.accepted }, { label: "Pending confirmation", value: summary.latest.pending }, { label: "Rejected", value: summary.latest.rejected }];
  return <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
    <h1 className="text-4xl font-semibold">Spam domain dashboard</h1>
    <p className="mt-3 text-sm text-muted-foreground">Latest recorded replacement file, not a cumulative total. Accepted and rejected are manually recorded; pending means unconfirmed acceptance, not Google processing. Prepared domains are not counted as submitted.</p>
    <div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" asChild><Link to="/backlinks/blocker">Flagged domains</Link></Button><Button variant="outline" asChild><Link to="/backlinks/disavow">Record upload</Link></Button></div>
    {uploads.isPending ? <p className="mt-8">Loading dashboard…</p> : null}
    {uploads.isError ? <div className="mt-8"><p role="alert" className="text-destructive">Couldn't load recorded uploads.</p><Button variant="outline" onClick={() => void uploads.refetch()}>Try again</Button></div> : null}
    {uploads.isSuccess ? <>
      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{metrics.map((metric) => <div className="border-t-2 border-border py-4" key={metric.label}><dt className="text-sm text-muted-foreground">{metric.label}</dt><dd className="mt-2 text-3xl font-semibold tabular-nums">{metric.value}</dd></div>)}</dl>
      {uploads.data.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No Google uploads recorded yet. Flagging or downloading domains does not record an upload.</p> : <p className="mt-3 text-sm text-muted-foreground">Latest file: {new Date(uploads.data[0]?.uploaded_at ?? "").toLocaleDateString()}</p>}
      <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">Monthly trend</h2><p className="mt-2 text-sm text-muted-foreground">Last replacement file per month, using currently recorded statuses. Months without uploads are omitted.</p>{summary.monthly.length ? <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm tabular-nums"><caption className="sr-only">Monthly domain submission and acceptance counts</caption><thead className="border-b border-border"><tr>{["Month", "Submitted", "Accepted", "Pending", "Rejected"].map((label) => <th scope="col" className="py-3 pr-4" key={label}>{label}</th>)}</tr></thead><tbody>{summary.monthly.map((month) => <tr className="border-b border-border" key={month.month}><th scope="row" className="py-3 pr-4 font-medium">{new Date(month.month + "-01T00:00:00Z").toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" })}</th><td>{month.submitted}</td><td>{month.accepted}</td><td>{month.pending}</td><td>{month.rejected}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-muted-foreground">No monthly records yet.</p>}</section>
      <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">Spam type breakdown</h2><p className="mt-2 text-sm text-muted-foreground">Latest file’s recorded domain flags. New uploads capture the saved flag at submission; older or untagged domains remain unclassified.</p><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm tabular-nums"><caption className="sr-only">Latest file domain counts by spam type</caption><thead className="border-b border-border"><tr>{["Type", "Submitted", "Accepted", "Pending", "Rejected"].map((label) => <th scope="col" className="py-3 pr-4" key={label}>{label}</th>)}</tr></thead><tbody>{types.map((type) => <tr key={type.type} className="border-b border-border"><th scope="row" className="py-3 pr-4 font-medium capitalize">{type.type}</th><td>{type.submitted}</td><td>{type.accepted}</td><td>{type.pending}</td><td>{type.rejected}</td></tr>)}</tbody></table></div></section>
      <DisavowDomainTracker uploads={uploads.data} />
    </> : null}
  </main>;
}