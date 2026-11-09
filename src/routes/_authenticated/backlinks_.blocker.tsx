import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Flag, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { buildPreparedDisavow, duplicateSpamIds, flaggedDomainEntries, normalizeSpamLink, prepareSpamReport } from "@/lib/spamLinks";

export const Route = createFileRoute("/_authenticated/backlinks_/blocker")({
  head: () => ({ meta: [
    { title: "Spam Blocker: Flagged Domains — Hygi" },
    { name: "description", content: "Manage domains flagged as phishing, malware or scams and build a prepared Google disavow file." },
    { property: "og:title", content: "Spam Blocker: Flagged Domains — Hygi" },
    { property: "og:description", content: "Review flagged backlink domains and download your automatically prepared disavow list." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: SpamBlockerPage,
});

function SpamBlockerPage() {
  const qc = useQueryClient();
  const [domain, setDomain] = useState("");
  const [category, setCategory] = useState("phishing");
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const list = useQuery({ queryKey: ["spam-link-entries"], queryFn: async () => {
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
  const add = useMutation({ mutationFn: async () => {
    if (!confirmed) throw new Error("Confirm that this domain links to Hygi and that you intend to disavow the entire domain.");
    const report = prepareSpamReport({ link: domain, threat_category: category });
    if (!report.normalized_link.startsWith("domain:")) throw new Error("Enter a domain only, without a page URL.");
    const { error } = await supabase.from("spam_link_entries").insert(report);
    if (error) throw error;
  }, onSuccess: () => { setDomain(""); setConfirmed(false); void qc.invalidateQueries({ queryKey: ["spam-link-entries"] }); } });
  const edit = useMutation({ mutationFn: async ({ id, status }: { id: string; status: "ready" | "excluded" }) => {
    const { error } = await supabase.from("spam_link_entries").update({ status }).eq("id", id).select("id").single();
    if (error) throw error;
  }, onSuccess: () => qc.invalidateQueries({ queryKey: ["spam-link-entries"] }) });
  const domains = flaggedDomainEntries(list.data ?? []);
  const duplicates = duplicateSpamIds(domains);
  const ready = domains.filter((row) => row.status === "ready" && !row.duplicate_flag && !duplicates.has(row.id));
  const file = ready.length ? buildPreparedDisavow(domains) : "# No flagged domains included yet\n";
  const filtered = domains.filter((row) => row.link.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || row.threat_category === filter));
  const currentPage = Math.min(page, Math.max(0, Math.ceil(filtered.length / 50) - 1));
  const download = () => {
    const url = URL.createObjectURL(new Blob([file], { type: "text/plain" }));
    const a = document.createElement("a"); a.href = url; a.download = "hygi-disavow.txt"; a.click(); URL.revokeObjectURL(url);
  };
  return <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
    <ShieldAlert className="h-8 w-8 text-primary" aria-hidden="true" /><h1 className="mt-3 text-4xl font-semibold">Spam Blocker</h1>
    <p className="mt-3 text-sm text-muted-foreground">Flagged backlink domains for your prepared disavow file. This does not block websites or remove links; Google upload is manual.</p>
    <aside className="mt-6 border-l-4 border-destructive bg-muted p-4"><h2 className="font-semibold">Whole-domain review</h2><p className="mt-2 text-sm text-muted-foreground">Only flag domains linking to Hygi. Google says most sites do not need disavow; excluding legitimate links can harm search performance. Each Google upload replaces the previous file: include older entries you still need. Your flags are your assessment, not a verified security finding.</p><a href="https://support.google.com/webmasters/answer/2648487" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm underline">Google’s guidance</a></aside>
    <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">Flag a domain</h2>
      <form className="mt-4 space-y-4" onSubmit={(event) => { event.preventDefault(); add.mutate(); }}>
        <label className="block text-sm font-medium" htmlFor="blocker-domain">Domain<Input id="blocker-domain" maxLength={253} required placeholder="example.com" className="mt-2" value={domain} onChange={(event) => setDomain(event.target.value)} /></label>
        <fieldset><legend className="text-sm font-medium">Threat flag</legend><div className="mt-2 flex flex-wrap gap-2">{["phishing", "malware", "scams"].map((value) => <Button type="button" key={value} className="capitalize" variant={value === category ? "secondary" : "outline"} aria-pressed={value === category} onClick={() => setCategory(value)}><Flag className="h-4 w-4" />{value}</Button>)}</div></fieldset>
        <div className="flex items-start gap-3"><Checkbox id="blocker-confirm" checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)} /><label className="text-sm" htmlFor="blocker-confirm">This domain links to Hygi, and I intend to disavow links from the entire domain.</label></div>
        <Button disabled={!domain.trim() || !confirmed || add.isPending} type="submit">{add.isPending ? "Saving…" : "Flag & include domain"}</Button>
        {add.isError ? <p role="alert" className="text-sm text-destructive">{add.error instanceof Error ? add.error.message : "Couldn't save domain."}</p> : null}{add.isSuccess ? <p role="status" className="text-sm text-primary">Domain saved. The prepared file updates automatically; duplicates stay excluded.</p> : null}
      </form>
    </section>
    <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">Flagged domains · {domains.length}</h2>
      <div className="mt-4 flex flex-wrap gap-3"><Input aria-label="Search flagged domains" placeholder="Search domains" className="max-w-sm" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} /><select aria-label="Filter threat flag" className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(0); }}><option value="all">All flags</option><option value="phishing">Phishing</option><option value="malware">Malware</option><option value="scams">Scams</option></select></div>
      {list.isPending ? <p className="mt-4">Loading domains…</p> : null}{list.isError ? <div className="mt-4"><p role="alert" className="text-destructive">Couldn't load flagged domains.</p><Button variant="outline" onClick={() => void list.refetch()}>Try again</Button></div> : null}{edit.isError ? <p role="alert" className="mt-3 text-destructive">Couldn't save the change. Try again.</p> : null}
      {list.isSuccess && !filtered.length ? <p className="mt-4 text-sm text-muted-foreground">No flagged domains in this view. URL-specific reports remain in the spam-link manager.</p> : null}
      {filtered.length ? <><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Flagged domains and file inclusion</caption><thead className="border-b border-border"><tr><th scope="col" className="py-3 pr-3">Domain</th><th scope="col" className="pr-3">Flag</th><th scope="col" className="pr-3">File status</th><th scope="col">Include</th></tr></thead><tbody>{filtered.slice(currentPage * 50, currentPage * 50 + 50).map((row) => {
        const duplicate = row.duplicate_flag || duplicates.has(row.id);
        return <tr key={row.id} className="border-b border-border"><th scope="row" className="break-all py-4 pr-3 font-medium">{normalizeSpamLink(row.link).slice(7)}</th><td className="pr-3 capitalize">{row.threat_category}</td><td className="pr-3">{duplicate ? "Duplicate · excluded" : row.status === "ready" ? "Included" : "Not included"}</td><td><Checkbox aria-label={`Include ${row.link}`} checked={row.status === "ready" && !duplicate} disabled={duplicate || edit.isPending} onCheckedChange={(value) => edit.mutate({ id: row.id, status: value === true ? "ready" : "excluded" })} /></td></tr>;
      })}</tbody></table></div><div className="mt-3 flex items-center gap-3"><Button size="sm" variant="outline" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</Button><span className="text-sm">{currentPage + 1} / {Math.ceil(filtered.length / 50)}</span><Button size="sm" variant="outline" disabled={(currentPage + 1) * 50 >= filtered.length} onClick={() => setPage(currentPage + 1)}>Next</Button></div></> : null}
    </section>
    <section className="mt-8 border-t border-border pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Prepared disavow file · {ready.length} domains</h2><Button disabled={!ready.length || !list.isSuccess} onClick={download}><Download className="h-4 w-4" />Download file</Button></div><pre className="mt-4 max-h-64 overflow-auto rounded-md border border-border bg-muted p-4 text-xs">{file}</pre></section>
    <div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/backlinks/overview">Spam domain dashboard</Link></Button><Button asChild variant="outline"><Link to="/backlinks/links">All links & duplicates</Link></Button><Button asChild variant="outline"><Link to="/backlinks/disavow">Google upload guide</Link></Button></div>
  </main>;
}