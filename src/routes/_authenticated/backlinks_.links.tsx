import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Flag, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildPreparedDisavow, duplicateSpamIds, normalizeSpamLink } from "@/lib/spamLinks";

export const Route = createFileRoute("/_authenticated/backlinks_/links")({
  head: () => ({ meta: [
    { title: "Spam Link Manager — Hygi" },
    { name: "description", content: "Review saved spam links, flag duplicates and prepare a disavow file before uploading to Google." },
    { property: "og:title", content: "Spam Link Manager — Hygi" },
    { property: "og:description", content: "Manage spam links and duplicate entries before submitting your disavow file." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: SpamLinkPage,
});

function SpamLinkPage() {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [downloadError, setDownloadError] = useState("");
  const entries = useQuery({ queryKey: ["spam-link-entries"], queryFn: async () => {
    const all = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase.from("spam_link_entries").select("*").order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
      if (error) throw error;
      all.push(...(data ?? []));
      if (!data || data.length < 500) break;
      offset += 500;
    }
    return all;
  } });
  const history = useQuery({ queryKey: ["spam-link-submitted-history"], queryFn: async () => {
    const all = [];
    let offset = 0;
    while (true) {
      const { data, error } = await supabase.from("disavow_domain_statuses").select("id, domain, status, disavow_uploads(uploaded_at)").order("updated_at", { ascending: false }).range(offset, offset + 499);
      if (error) throw error;
      all.push(...(data ?? []));
      if (!data || data.length < 500) break;
      offset += 500;
    }
    return all;
  } });
  const add = useMutation({ mutationFn: async () => {
    const links = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (!links.length) throw new Error("Enter at least one domain or full link.");
    if (links.length > 500) throw new Error("Add up to 500 entries at a time.");
    const rows = links.map((link) => ({ link, normalized_link: normalizeSpamLink(link) }));
    const { error } = await supabase.from("spam_link_entries").insert(rows);
    if (error) throw error;
  }, onSuccess: () => { setText(""); void qc.invalidateQueries({ queryKey: ["spam-link-entries"] }); } });
  const edit = useMutation({ mutationFn: async ({ id, patch, remove }: { id: string; patch?: { status?: string; duplicate_flag?: boolean }; remove?: boolean }) => {
    const result = remove ? await supabase.from("spam_link_entries").delete().eq("id", id).select("id").single() : await supabase.from("spam_link_entries").update(patch ?? {}).eq("id", id).select("id").single();
    if (result.error) throw result.error;
  }, onSuccess: () => qc.invalidateQueries({ queryKey: ["spam-link-entries"] }) });
  const rows = entries.data ?? [];
  const duplicateIds = duplicateSpamIds(rows);
  const displayed = rows.filter((row) => row.link.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || (filter === "duplicates" ? row.duplicate_flag || duplicateIds.has(row.id) : row.status === filter)));
  const currentPage = Math.min(page, Math.max(0, Math.ceil(displayed.length / 50) - 1));
  const ready = rows.filter((row) => row.status === "ready" && !row.duplicate_flag && !duplicateIds.has(row.id)).length;
  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";
  const download = () => {
    setDownloadError("");
    try {
      const file = buildPreparedDisavow(rows);
      const url = URL.createObjectURL(new Blob([file], { type: "text/plain" }));
      const a = document.createElement("a"); a.href = url; a.download = "hygi-disavow.txt"; a.click(); URL.revokeObjectURL(url);
    } catch (error) { setDownloadError(error instanceof Error ? error.message : "Couldn't download file."); }
  };
  return <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
    <h1 className="text-4xl font-semibold">Spam link manager</h1>
    <p className="mt-3 text-sm text-muted-foreground">Preparation statuses are separate from Google's acceptance. Duplicate flags keep entries out of your download.</p>
    <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" asChild><Link to="/backlinks/disavow">Google upload guide</Link></Button><Button variant="outline" asChild><Link to="/backlinks">Backlinks</Link></Button></div>
    <section className="mt-8 border-t border-border pt-6">
      <h2 className="text-xl font-semibold">Add spam links</h2>
      <label htmlFor="spam-links" className="mt-3 block text-sm">Domains or full http/https links, one per line</label>
      <Textarea id="spam-links" className="mt-2" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
      <Button className="mt-3" disabled={!text.trim() || add.isPending} onClick={() => add.mutate()}><Plus className="h-4 w-4" />{add.isPending ? "Saving…" : "Save links"}</Button>
      {add.isError ? <p role="alert" className="mt-2 break-words text-sm text-destructive">{add.error instanceof Error ? add.error.message : "Couldn't save links."}</p> : null}
      {add.isSuccess ? <p role="status" className="mt-2 text-sm text-primary">Links saved for review.</p> : null}
    </section>
    <section className="mt-10 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Before upload · {rows.length} entries</h2><Button disabled={!ready} onClick={download}><Download className="h-4 w-4" />Download ready ({ready})</Button></div>
      <p className="mt-2 text-sm text-muted-foreground">Review each entry carefully. Google says most sites do not need disavow; an incorrect list can harm search performance. Each upload replaces the previous file, so include any old entries you still need. Full links stay URL-specific; domains apply to the entire domain.</p>
      <div className="mt-4 flex flex-wrap gap-3"><Input aria-label="Search spam links" placeholder="Search links" className="max-w-sm" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} /><select aria-label="Filter preparation status" className={selectClass} value={filter} onChange={(e) => { setFilter(e.target.value); setPage(0); }}><option value="all">All entries</option><option value="review">Needs review</option><option value="ready">Ready</option><option value="excluded">Excluded</option><option value="duplicates">Duplicates</option></select></div>
      {entries.isPending ? <p className="mt-4">Loading links…</p> : null}
      {entries.isError ? <div className="mt-4"><p role="alert" className="text-destructive">Couldn't load saved links.</p><Button variant="outline" onClick={() => void entries.refetch()}>Try again</Button></div> : null}
      {edit.isError || downloadError ? <p role="alert" className="mt-3 text-destructive">{downloadError || "Couldn't save that change. Try again."}</p> : null}
      {entries.isSuccess && !displayed.length ? <p className="mt-5 text-sm text-muted-foreground">No links in this view.</p> : null}
      {displayed.length > 0 ? <><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Spam links and preparation statuses</caption><thead className="border-b border-border"><tr><th scope="col" className="py-3 pr-4">Link / domain</th><th scope="col" className="py-3 pr-4">Status</th><th scope="col" className="py-3 pr-4">Duplicate</th><th scope="col" className="py-3">Remove</th></tr></thead><tbody>{displayed.slice(currentPage * 50, currentPage * 50 + 50).map((row) => <tr key={row.id} className="border-b border-border"><th scope="row" className="max-w-sm break-all py-4 pr-4 font-medium">{row.link}</th><td className="py-4 pr-4"><select className={selectClass} aria-label={`Preparation status for ${row.link}`} disabled={edit.isPending} value={row.status} onChange={(e) => edit.mutate({ id: row.id, patch: { status: e.target.value } })}><option value="review">Needs review</option><option value="ready">Ready</option><option value="excluded">Excluded</option></select></td><td className="py-4 pr-4"><Button size="sm" variant={row.duplicate_flag ? "secondary" : "outline"} title={row.duplicate_flag ? "Clear duplicate flag" : "Flag duplicate"} aria-label={`${row.duplicate_flag ? "Clear duplicate flag" : "Flag duplicate"} for ${row.link}`} aria-pressed={row.duplicate_flag} disabled={edit.isPending} onClick={() => edit.mutate({ id: row.id, patch: { duplicate_flag: !row.duplicate_flag } })}><Flag className="h-4 w-4" />{row.duplicate_flag ? "Flagged" : "Flag"}</Button>{duplicateIds.has(row.id) ? <span className="mt-1 block text-xs text-muted-foreground">Auto duplicate · excluded</span> : null}</td><td><Button size="icon" variant="ghost" title="Remove entry" aria-label={`Remove ${row.link}`} disabled={edit.isPending} onClick={() => { if (window.confirm(`Remove ${row.link} from the preparation list?`)) edit.mutate({ id: row.id, remove: true }); }}><Trash2 className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div><div className="mt-4 flex items-center gap-3"><Button variant="outline" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</Button><span className="text-sm">{currentPage + 1} / {Math.ceil(displayed.length / 50)}</span><Button variant="outline" disabled={(currentPage + 1) * 50 >= displayed.length} onClick={() => setPage(currentPage + 1)}>Next</Button></div></> : null}
    </section>
    <section className="mt-10 border-t border-border pt-6"><h2 className="text-xl font-semibold">Previously submitted domains</h2><p className="mt-2 text-sm text-muted-foreground">Manual Google acceptance records, separate from the preparation list.</p>{history.isPending ? <p className="mt-4">Loading submissions…</p> : null}{history.isError ? <p role="alert" className="mt-4 text-destructive">Couldn't load submitted domains.</p> : null}{history.isSuccess && !history.data.length ? <p className="mt-4 text-sm text-muted-foreground">No uploaded files recorded yet.</p> : null}{history.data?.length ? <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th scope="col" className="py-3">Domain</th><th scope="col">Status</th><th scope="col">File date</th></tr></thead><tbody>{history.data.map((row) => <tr key={row.id} className="border-t border-border"><td className="break-all py-3 pr-3">{row.domain}</td><td className="pr-3 capitalize">{row.status}</td><td>{row.disavow_uploads ? new Date(row.disavow_uploads.uploaded_at).toLocaleDateString() : "—"}</td></tr>)}</tbody></table></div> : null}</section>
  </main>;
}