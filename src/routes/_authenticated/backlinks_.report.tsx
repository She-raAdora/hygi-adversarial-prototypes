import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileSearch } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { duplicateSpamIds, normalizeSpamLink } from "@/lib/spamLinks";

export const Route = createFileRoute("/_authenticated/backlinks_/report")({
  head: () => ({ meta: [
    { title: "Spam Report: Review Domain Sources — Hygi" },
    { name: "description", content: "Review entered spam domains, original source entries, spam categories and duplicate exclusions before uploading to Google." },
    { property: "og:title", content: "Spam Report: Review Domain Sources — Hygi" },
    { property: "og:description", content: "Pre-upload review of domain sources, flags and prepared file status." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: SpamReportPage,
});

function SpamReportPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const entries = useQuery({ queryKey: ["spam-link-entries"], queryFn: async () => {
    const rows = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await supabase.from("spam_link_entries").select("*").order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
      if (error) throw error;
      rows.push(...(data ?? []));
      if (!data || data.length < 500) return rows;
    }
  } });
  const domains = (entries.data ?? []).filter((row) => normalizeSpamLink(row.link).startsWith("domain:"));
  const duplicates = duplicateSpamIds(domains);
  const filtered = domains.filter((row) => row.link.toLowerCase().includes(search.trim().toLowerCase()) && (category === "all" || (row.threat_category ?? "unclassified") === category));
  const currentPage = Math.min(page, Math.max(0, Math.ceil(filtered.length / 50) - 1));
  return <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
    <FileSearch aria-hidden="true" className="h-8 w-8 text-primary" />
    <h1 className="mt-3 text-4xl font-semibold">Spam report</h1>
    <p className="mt-3 text-sm text-muted-foreground">Domains entered for preparation, not confirmed Google submissions. Source shows the original entry you saved; discovery pages and services were not recorded. Spam categories are your assessment.</p>
    <div className="mt-5 flex flex-wrap gap-3"><Button variant="outline" asChild><Link to="/backlinks/blocker">Review flagged domains</Link></Button><Button variant="outline" asChild><Link to="/backlinks/links">Edit entries & duplicates</Link></Button><Button variant="outline" asChild><Link to="/backlinks/disavow">Google upload guide</Link></Button></div>
    <aside className="mt-6 border-l-4 border-destructive bg-muted p-4"><h2 className="font-semibold">Before uploading</h2><p className="mt-2 text-sm text-muted-foreground">Google says most sites do not need disavow. Removing legitimate links can harm search performance. Each upload replaces the previous file; retain older domains you still need. Page-specific URL reports stay in the link manager and are not expanded to whole domains.</p></aside>
    <section className="mt-8 border-t border-border pt-6"><h2 className="text-xl font-semibold">Domain review</h2>
      <div className="mt-4 flex flex-wrap gap-3"><Input aria-label="Search reported domains" placeholder="Search domains" className="max-w-sm" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} /><select aria-label="Filter source category" className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={category} onChange={(event) => { setCategory(event.target.value); setPage(0); }}><option value="all">All categories</option><option value="phishing">Phishing</option><option value="malware">Malware</option><option value="scams">Scams</option><option value="unclassified">Unclassified</option></select></div>
      {entries.isPending ? <p className="mt-4">Loading report…</p> : null}
      {entries.isError ? <div className="mt-4"><p role="alert" className="text-destructive">Couldn't load the report.</p><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
      {entries.isSuccess && !filtered.length ? <p className="mt-4 text-sm text-muted-foreground">No domains match this report. Add domains in Spam Blocker or the link manager.</p> : null}
      {filtered.length ? <><p className="mt-4 text-sm text-muted-foreground">{filtered.length} domain entries</p><div className="mt-3 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Prepared domains with original sources and file status</caption><thead className="border-b border-border"><tr>{["Domain", "Source entry", "Source category", "File status", "Entered"].map((label) => <th key={label} scope="col" className="py-3 pr-4">{label}</th>)}</tr></thead><tbody>{filtered.slice(currentPage * 50, currentPage * 50 + 50).map((row) => <tr key={row.id} className="border-b border-border"><th scope="row" className="break-all py-4 pr-4 font-medium">{normalizeSpamLink(row.link).slice(7)}</th><td className="max-w-64 break-all pr-4">{row.link}</td><td className="pr-4 capitalize">{row.threat_category ?? "Unclassified"}</td><td className="pr-4">{row.duplicate_flag || duplicates.has(row.id) ? "Duplicate · excluded" : row.status === "ready" ? "Ready" : row.status === "excluded" ? "Excluded" : "Needs review"}</td><td className="pr-4">{new Date(row.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div><div className="mt-4 flex items-center gap-3"><Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</Button><span className="text-sm">{currentPage + 1} / {Math.ceil(filtered.length / 50)}</span><Button variant="outline" size="sm" disabled={(currentPage + 1) * 50 >= filtered.length} onClick={() => setPage(currentPage + 1)}>Next</Button></div></> : null}
    </section>
  </main>;
}