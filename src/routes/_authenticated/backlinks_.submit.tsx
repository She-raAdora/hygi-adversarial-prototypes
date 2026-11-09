import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { prepareSpamReport } from "@/lib/spamLinks";

export const Route = createFileRoute("/_authenticated/backlinks_/submit")({
  head: () => ({ meta: [
    { title: "Submit a Spam Backlink — Hygi" },
    { name: "description", content: "Flag phishing, malware or scam backlinks pointing to Hygi and add them to your prepared disavow file." },
    { property: "og:title", content: "Submit a Spam Backlink — Hygi" },
    { property: "og:description", content: "Record harmful backlinks for your prepared Google disavow file." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: SubmitSpamPage,
});

function SubmitSpamPage() {
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("phishing");
  const [confirmed, setConfirmed] = useState(false);
  const qc = useQueryClient();
  const submit = useMutation({ mutationFn: async () => {
    if (!confirmed) throw new Error("Confirm this backlink points to Hygi.");
    const report = prepareSpamReport({ link, threat_category: category });
    const { error } = await supabase.from("spam_link_entries").insert(report);
    if (error) throw error;
  }, onSuccess: () => { setLink(""); setConfirmed(false); void qc.invalidateQueries({ queryKey: ["spam-link-entries"] }); } });
  return <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
    <ShieldAlert className="h-8 w-8 text-primary" aria-hidden="true" />
    <h1 className="mt-4 text-4xl font-semibold">Submit a spam backlink</h1>
    <p className="mt-3 text-sm text-muted-foreground">Links on other websites pointing to Hygi only. Submitting adds the entry to your prepared disavow file, not to Google.</p>
    <aside className="mt-6 border-l-4 border-destructive bg-muted p-4"><h2 className="font-semibold">Before including a link</h2><p className="mt-2 text-sm text-muted-foreground">Google says most sites do not need disavow. Incorrectly disavowing good links can harm search performance. A threat flag records your assessment, not a verified security finding.</p><a className="mt-2 inline-block text-sm underline underline-offset-4" href="https://support.google.com/webmasters/answer/2648487" target="_blank" rel="noreferrer">Google’s official guidance</a></aside>
    <form className="mt-8 space-y-6" onSubmit={(event) => { event.preventDefault(); submit.mutate(); }}>
      <div><label htmlFor="report-link" className="text-sm font-medium">Source page URL or domain</label><Input className="mt-2" id="report-link" maxLength={2048} required value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://example.com/page" /><p className="mt-2 text-xs text-muted-foreground">A full URL includes only that page; a domain includes links across the entire domain. Hygi does not open or scan the link.</p></div>
      <fieldset><legend className="text-sm font-medium">Threat flag</legend><div className="mt-3 flex flex-wrap gap-2">{[{ value: "phishing", label: "Phishing" }, { value: "malware", label: "Malware" }, { value: "scams", label: "Scams" }].map((item) => <Button key={item.value} type="button" variant={category === item.value ? "secondary" : "outline"} aria-pressed={category === item.value} onClick={() => setCategory(item.value)}><Flag className="h-4 w-4" />{item.label}</Button>)}</div></fieldset>
      <div className="flex items-start gap-3"><Checkbox id="confirm-backlink" checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)} /><label htmlFor="confirm-backlink" className="text-sm">I checked that this source links to digitalhygiene.app and want to include it in the prepared file.</label></div>
      <Button type="submit" disabled={!confirmed || !link.trim() || submit.isPending}>{submit.isPending ? "Saving…" : "Add to disavow file"}</Button>
      {submit.isError ? <p role="alert" className="text-sm text-destructive">Couldn't save. Check the URL or domain and try again.</p> : null}
      {submit.isSuccess ? <p role="status" className="text-sm text-primary">Saved as ready with your threat flag. Duplicate entries stay out of the download.</p> : null}
    </form>
    <div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" asChild><Link to="/backlinks/blocker">Spam Blocker domains</Link></Button><Button variant="outline" asChild><Link to="/backlinks/links">Manage links & download file</Link></Button><Button variant="outline" asChild><Link to="/backlinks/disavow">Google upload guide</Link></Button></div>
  </main>;
}