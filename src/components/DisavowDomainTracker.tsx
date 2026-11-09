import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { type DisavowUpload } from "@/lib/disavow";

export function DisavowDomainTracker({ uploads }: { uploads: DisavowUpload[] }) {
  const [uploadId, setUploadId] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const qc = useQueryClient();
  const upload = uploads.find((item) => item.id === uploadId) ?? uploads[0];
  const rows = (upload?.disavow_domain_statuses ?? []).filter((row) => filter === "all" || row.status === filter).sort((a, b) => a.domain.localeCompare(b.domain));
  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "accepted" | "pending" | "rejected" }) => {
      const { data, error } = await supabase.from("disavow_domain_statuses").update({ status }).eq("id", id).select("id").single();
      if (error) throw error;
      if (!data) throw new Error("Status was not saved.");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disavow-uploads"] }),
  });
  const currentPage = Math.min(page, Math.max(0, Math.ceil(rows.length / 50) - 1));
  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";
  return <div className="mt-8">
    <h3 className="text-lg font-semibold">Submitted domain statuses</h3>
    <p className="mt-2 text-sm text-muted-foreground">Manually recorded from Google's confirmation or file errors. Pending means unconfirmed acceptance, not Google processing. Google does not report individual link-processing status to Hygi.</p>
    {!upload ? <p className="mt-4 text-sm text-muted-foreground">No submitted domains recorded yet.</p> : <>
      <div className="mt-4 flex flex-wrap gap-3">
        <label className="flex min-w-0 flex-col gap-1 text-sm">Submitted file
          <select className={selectClass} value={upload.id} onChange={(e) => { setUploadId(e.target.value); setPage(0); }}>
            {uploads.map((item, index) => <option key={item.id} value={item.id}>{new Date(item.uploaded_at).toLocaleString()} · {item.domains_selected} domains{index === 0 ? " · Latest" : ""}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">Status filter
          <select className={selectClass} value={filter} onChange={(e) => { setFilter(e.target.value); setPage(0); }}>
            <option value="all">All statuses</option><option value="accepted">Accepted</option><option value="pending">Pending</option><option value="rejected">Rejected</option>
          </select>
        </label>
      </div>
      {update.isError ? <p role="alert" className="mt-3 text-sm text-destructive">Couldn't save the status. Please try again.</p> : null}
      {update.isSuccess ? <p role="status" className="mt-3 text-sm text-primary">Status saved.</p> : null}
      {rows.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">No domains match this view.</p> : <>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm">
          <caption className="sr-only">Manually recorded domain acceptance statuses</caption>
          <thead className="border-b border-border"><tr><th className="py-3 pr-3" scope="col">Domain</th><th className="py-3 pr-3" scope="col">Status</th><th className="py-3" scope="col">Last updated</th></tr></thead>
          <tbody>{rows.slice(currentPage * 50, currentPage * 50 + 50).map((row) => <tr key={row.id} className="border-b border-border">
            <th scope="row" className="max-w-64 break-all py-3 pr-3 font-medium">{row.domain}</th>
            <td className="py-3 pr-3"><select aria-label={`Status for ${row.domain}`} className={selectClass} disabled={update.isPending} value={row.status} onChange={(e) => {
              const status = e.target.value;
              if (status === "accepted" || status === "pending" || status === "rejected") update.mutate({ id: row.id, status });
            }}><option value="accepted">Accepted</option><option value="pending">Pending</option><option value="rejected">Rejected</option></select></td>
            <td className="py-3 text-muted-foreground">{new Date(row.updated_at).toLocaleDateString()}</td>
          </tr>)}</tbody>
        </table></div>
        <div className="mt-3 flex items-center gap-3"><Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</Button><span className="text-sm">{currentPage + 1} / {Math.ceil(rows.length / 50)}</span><Button variant="outline" size="sm" disabled={(currentPage + 1) * 50 >= rows.length} onClick={() => setPage(currentPage + 1)}>Next</Button></div>
      </>}
    </>}
  </div>;
}